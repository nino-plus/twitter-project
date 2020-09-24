import * as functions from 'firebase-functions';
import * as Twitter from 'twitter';
import * as admin from 'firebase-admin'
import * as express from 'express';

const config = functions.config();
const db = admin.firestore();

const app = express();
app.get('/', async (req: any, res: any) => {
  const tasksQuerySnapshot = (await db.collectionGroup(`tasks`)
    .where('isComplete', '==', false)
    .get());
  if (tasksQuerySnapshot) {
    tasksQuerySnapshot.forEach(async (taskDocumentSnapshot) => {
      functions.logger.info(taskDocumentSnapshot.data());
      const uid = taskDocumentSnapshot.data()?.uid;
      await tweet(uid);
      const tweetsQuerySnapshot = (await db.collectionGroup(`tweets`)
        .orderBy("likeCount", "asc")
        .get());
      if (tweetsQuerySnapshot) {
        const tweetIds: any[] = [];
        tweetsQuerySnapshot.forEach((tweetDocumentSnapshot) => {
          functions.logger.info(tweetDocumentSnapshot.data());
          tweetIds.push(tweetDocumentSnapshot.data()?.tweetId);
        });
        await reTweet(uid, shuffleTweets(tweetIds)[0]);
        return;
      }
    });
    return;
  }
  res.send('success');
});
export const checkTaskComplete = functions.region('asia-northeast1').https.onRequest(app);

function shuffleTweets(tweets: any[]) {
  for (let i = tweets.length - 1; i > 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1));
    [tweets[i], tweets[rand]] = [tweets[rand], tweets[i]];
  }
  return tweets;
}

export const checkTaskCompleteTest = functions.region('asia-northeast1').https.onCall(async (uid) => {
  functions.logger.info(uid);
  const tasksQuerySnapshot = (await db.collectionGroup(`tasks`)
    .where('uid', '==', uid)
    .where('isComplete', '==', false)
    .get());
  if (tasksQuerySnapshot) {
    tasksQuerySnapshot.forEach(async (taskDocumentSnapshot) => {
      functions.logger.info(taskDocumentSnapshot.data());
    });
  }
});

async function tweet(uid: string) {
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
    await twitterClient.post('statuses/update', {
      status: '昨日までのタスクが完了しなかったため、過去ツイートをRTさせていただきます！ | 爆つい💣'
    }).then((response) => {
      functions.logger.info(response);
    }).catch((error) => {
      throw error;
    });
    return true;
  } else {
    throw new Error('認証に失敗しました');
  }
};

async function reTweet(uid: string, tweetId: string) {
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
    await twitterClient.post('statuses/retweet', {
      id: tweetId
    }).then((response) => {
      functions.logger.info(response);
    }).catch((error) => {
      throw error;
    });
    return true;
  } else {
    throw new Error('認証に失敗しました');
  }
};

export async function saveUserTweet(uid: string) {
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
    await twitterClient.get('statuses/user_timeline', {
      user_id: twitterData.twitterUid,
      since_id: 1,
      count: 200,
      exclude_replies: true,
    }).then((response) => {
      functions.logger.info(response);
      const resData = response;
      const batch = db.batch();
      resData.forEach(async (tweetContent: {
        id_str: '1302129035489587200',
        favorite_count: 0,
      }) => {
        const tweetId = tweetContent.id_str;
        const likeCount = tweetContent.favorite_count;
        const tweetRef = db.doc(`private/${uid}/tweets/${tweetId}`);
        batch.set(tweetRef, {
          tweetId,
          likeCount,
        });
      });
      return batch.commit();
    }).catch((error) => {
      throw error;
    });
    return true;
  } else {
    throw new Error('認証に失敗しました');
  }
};

