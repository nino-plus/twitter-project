import * as functions from 'firebase-functions';
import { markEventTried, shouldEventRun } from './utils/should.function';
import * as Twitter from 'twitter';
import * as admin from 'firebase-admin'

const config = functions.config();
const db = admin.firestore();

export const saveTweetData = functions.region('asia-northeast1')
  .firestore.document('users/{uid}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const uid = data.uid;
    const eventId = context.eventId;
    return shouldEventRun(eventId).then(async (should: boolean) => {
      if (should) {
        await saveUserTweet(uid);
        return markEventTried(eventId);
      } else {
        return;
      }
    });
  });

async function saveUserTweet(uid: string) {
  const twitterData = (await db
    .doc(`private/${uid}`)
    .get()).data();
  functions.logger.info(twitterData);
  if (twitterData) {
    const twitterClient = new Twitter({
      consumer_key: config.twitter.consumer_key,
      consumer_secret: config.twitter.secret_key,
      access_token_key: twitterData.access_token_key,
      access_token_secret: twitterData.access_token_secret
    });
    // tslint:disable-next-line: prefer-const
    let allTweetCount = 0;
    const twitterUid = twitterData.twitterUid;
    return getTweetAndSave(twitterClient, twitterUid, uid, allTweetCount);
  } else {
    throw new Error('認証に失敗しました');
  }
};

async function getTweetAndSave(twitterClient: Twitter, twitterUid: string, uid: string, allTweetCount: number, last_id?: number) {
  let params;
  if (last_id) {
    params = {
      user_id: twitterUid,
      max_id: last_id,
      count: 200,
      exclude_replies: true,
      include_rts: false,
    }
  } else {
    params = {
      user_id: twitterUid,
      count: 200,
      exclude_replies: true,
      include_rts: false,
    }
  }
  await twitterClient.get('statuses/user_timeline', params)
    .then(async (tweets) => {
      functions.logger.info(tweets);
      // tslint:disable-next-line: no-parameter-reassignment
      allTweetCount += tweets.length;
      functions.logger.info(allTweetCount);
      const lastTweetId = +tweets[tweets.length - 1]?.id_str - 1;
      functions.logger.info(lastTweetId);
      const batch = db.batch();
      tweets.forEach((tweetContent: {
        id_str: string,
        favorite_count: number,
        retweeted: boolean,
      }) => {
        const tweetId = tweetContent.id_str;
        const likeCount = tweetContent.favorite_count;
        const tweetRef = db.doc(`private/${uid}/tweets/${tweetId}`);
        batch.set(tweetRef, {
          tweetId,
          likeCount,
        });
      });
      await batch.commit();
      if (tweets.length > 0) {
        await getTweetAndSave(twitterClient, twitterUid, uid, allTweetCount, lastTweetId);
      }
      return;
    }).catch((error) => {
      throw error;
    });
}
