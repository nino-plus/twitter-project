import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { firestore } from 'firebase';
import { Observable } from 'rxjs';
import { Task } from '../interfaces/task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(
    private db: AngularFirestore,
    private fns: AngularFireFunctions
  ) {}

  formatDate(i: number): string {
    let num: string;
    if (i < 10) {
      num = '0' + i;
    } else {
      num = String(i);
    }
    return num;
  }

  formatToday(): string {
    const today = new Date();
    const formatDate = {
      year: this.formatDate(today.getFullYear()),
      month: this.formatDate(today.getMonth() + 1),
      date: this.formatDate(today.getDate()),
    };
    return formatDate.year + formatDate.month + formatDate.date;
  }

  getTodayTask(uid: string): Observable<Task | any> {
    const today = this.formatToday();
    return this.db.doc(`users/${uid}/tasks/${today}`).valueChanges();
  }

  createTask(uid: string, taskTitle: string): Promise<void> {
    const taskId = this.formatToday();
    return this.db.doc(`users/${uid}/tasks/${taskId}`).set({
      id: taskId,
      uid,
      title: taskTitle,
      isComplete: false,
      createdAt: firestore.Timestamp.now(),
    });
  }

  complateTask(uid: string, createDate: string): Promise<void> {
    return this.db.doc(`users/${uid}/tasks/${createDate}`).update({
      isComplete: true,
    });
  }
}
