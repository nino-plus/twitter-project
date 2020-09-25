import * as functions from 'firebase-functions';
import { markEventTried, shouldEventRun } from './utils/should.function';
import { saveUserTweet } from './twitter.function';

export const saveTweetData = functions.region('asia-northeast1')
  .firestore.document('users/{uid}/tasks/{taskDate}')
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
