import { firestore } from 'firebase';

export interface Task {
  id?: string;
  title?: string;
  isComplate?: boolean;
  createdAt?: firestore.Timestamp;
}
