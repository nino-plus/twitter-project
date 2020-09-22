import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private db: AngularFirestore) {}

  getTodayTask(uid: string): Observable<any> {
    // TODO 今日のタスクを取得する
    return this.db.doc(`users/${uid}/tasks`).valueChanges();
  }

  createTask(uid: string, taskTitle: string): Promise<void> {
    const taskId = this.db.createId();
    return this.db.doc(`users/${uid}/tasks/${taskId}`).set({
      id: taskId,
      title: taskTitle,
      isComplate: false,
      createdAt: firestore.Timestamp.now(),
    });
  }
}
