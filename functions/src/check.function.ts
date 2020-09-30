import * as functions from 'firebase-functions';
import * as Twitter from 'twitter';
import * as admin from 'firebase-admin'

const config = functions.config();
const db = admin.firestore();

export const checkTaskCompleteScheduler = functions
  .region('asia-northeast1')
  .pubsub.schedule('0 0 * * *')
  .timeZone('Asia/Tokyo')
  .onRun((_) => {
    return checkTaskAndTweet();
  });

export const checkTaskComplete = functions
  .region('asia-northeast1')
  .https.onRequest(async (req: any, res: any) => {
    await checkTaskAndTweet();
    res.status(200).send(true);
  });

async function checkTaskAndTweet() {
  const yesterday = formatYesterday();
  functions.logger.info(yesterday);
  const tasksQuerySnapshot = (await db.collectionGroup(`tasks`)
    .where('id', '==', yesterday)
    .where('isComplete', '==', false)
    .get());
  if (tasksQuerySnapshot) {
    tasksQuerySnapshot.forEach(async (taskDocumentSnapshot) => {
      functions.logger.info(taskDocumentSnapshot.data());
      const uid = taskDocumentSnapshot.data()?.uid;
      const twitterData = (await db
        .doc(`private/${uid}`)
        .get()).data();
      if (twitterData) {
        const twitterClient = new Twitter({
          consumer_key: config.twitter.consumer_key,
          consumer_secret: config.twitter.secret_key,
          access_token_key: twitterData.access_token_key,
          access_token_secret: twitterData.access_token_secret
        });
        await tweet(twitterClient);
        const tweetsQuerySnapshot = (await db.collection(`private/${uid}/tweets`)
          .orderBy("likeCount", "asc").limit(50)
          .get());
        if (tweetsQuerySnapshot) {
          const tweetIds: any[] = [];
          tweetsQuerySnapshot.forEach((tweetDocumentSnapshot) => {
            functions.logger.info(tweetDocumentSnapshot.data());
            tweetIds.push(tweetDocumentSnapshot.data()?.tweetId);
          });
          await reTweet(twitterClient, shuffleTweets(tweetIds)[0]);
          return;
        }
      } else {
        throw new Error('認証に失敗しました');
      }
    });
    return;
  }
}

function formatDate(i: number): string {
  let num: string;
  if (i < 10) {
    num = '0' + i;
  } else {
    num = String(i);
  }
  return num;
}

function formatYesterday(): string {
  const jstOffset = 9 * 60 * 60 * 1000;
  const yesterday = new Date();
  const offset = yesterday.getTimezoneOffset() + jstOffset;
  const day = 24 * 60 * 60 * 1000;
  yesterday.setTime(yesterday.getTime() + offset - day);
  const formatDateData = {
    year: formatDate(yesterday.getFullYear()),
    month: formatDate(yesterday.getMonth() + 1),
    date: formatDate(yesterday.getDate()),
  };
  return formatDateData.year + formatDateData.month + formatDateData.date;
}

function shuffleTweets(tweets: any[]) {
  for (let i = tweets.length - 1; i > 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1));
    [tweets[i], tweets[rand]] = [tweets[rand], tweets[i]];
  }
  return tweets;
}

async function tweet(twitterClient: Twitter) {
  const kaomoji = randomKaomoji();
  await twitterClient.post('statuses/update', {
    status: '昨日の目標が達成されなかったため、過去ツイートをRTさせていただきます' + kaomoji + '　|　爆つい💣'
  }).then((tweetData) => {
    functions.logger.info('Tweet Success');
    functions.logger.info(tweetData);
  }).catch((error) => {
    throw error;
  });
  return true;
};

const kaomojiList = ['😭', '😇', '😢', '😢', '😢', '(T ^ T)', '(´･_･`)'];
function randomKaomoji() {
  const randomIndex = Math.floor(Math.random() * kaomojiList.length);
  return kaomojiList[randomIndex];
}

async function reTweet(twitterClient: Twitter, tweetId: string,) {
  await twitterClient.post('statuses/retweet', {
    id: tweetId
  }).then((tweetData) => {
    functions.logger.info('RT Success');
    functions.logger.info(tweetData);
  }).catch((error) => {
    throw error;
  });
  return true;
};
