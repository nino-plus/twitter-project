import { firestore } from 'firebase';

export interface Task {
  id: string;
  title: string;
  isComplate: boolean;
  createDate: string;
  createdAt: firestore.Timestamp;
}
