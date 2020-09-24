import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);
export {
  checkTaskComplete,
  checkTaskCompleteTest
} from './twitter.function';
export {
  saveTweetData,
} from './task.function';
