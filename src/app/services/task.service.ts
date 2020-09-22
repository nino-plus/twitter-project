import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Task } from '../interfaces/task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private db: AngularFirestore) {}

  formatDate(i: number): string {
    let num;
    if (i < 10) {
      num = '0' + i;
    } else {
      num = String(i);
    }
    return num;
  }

  formatToday() {
    const today = new Date();
    const formatDate = {
      year: this.formatDate(today.getFullYear()),
      month: this.formatDate(today.getMonth() + 1),
      date: this.formatDate(today.getDate())
    };
    return formatDate.year + formatDate.month + formatDate.date;
  }

  getTodayTask(uid: string): Observable<Task> {
    const today = this.formatToday();
    return this.db.doc(`users/${uid}/tasks/${today}`).valueChanges();
  }

  createTask(uid: string, taskTitle: string) {
    const taskId = this.formatToday();
    return this.db.doc(`users/${uid}/tasks/${taskId}`).set({
      id: taskId,
      title: taskTitle,
      isComplate: false,
      createdAt: firestore.Timestamp.now(),
    });
  }

  complateTask(uid: string, createDate: string) {
    return this.db.doc(`users/${uid}/tasks/${createDate}`).update({
      isComplate: true
    });
  }
}
