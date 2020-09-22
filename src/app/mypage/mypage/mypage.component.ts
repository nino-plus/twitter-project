import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firestore } from 'firebase';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Task } from 'src/app/interfaces/task';
import { AuthService } from 'src/app/services/auth.service';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-mypage',
  templateUrl: './mypage.component.html',
  styleUrls: ['./mypage.component.scss'],
})
export class MypageComponent implements OnInit {
  limitTime = 24;
  formatToday = this.taskService.formatToday();
  userTask$: Observable<Task>;
  taskTitleMaxLength = 20;

  form = this.fb.group({
    title: [
      '',
      [Validators.required, Validators.maxLength(this.taskTitleMaxLength)],
    ],
  });

  constructor(
    public authService: AuthService,
    private taskService: TaskService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.authService.afUser$
      .pipe(take(1))
      .toPromise()
      .then((user) => {
        this.userTask$ = this.getTodayTask(user.uid);
        console.log(user.uid); // uidが表示 OK
        console.log(this.formatToday); // yyyymmdd形式で表示 OK
        console.log(this.getTodayTask(user.uid)); // undifindになる
      });
  }

  getTodayTask(uid: string): Observable<Task> {
    return this.taskService.getTodayTask(uid);
  }

  creatTask(uid: string) {
    this.taskService.createTask(uid, this.form.value.title).then(() => {
      this.snackBar.open('目標を登録しました！');
    });
  }

  complateTask(uid: string, taskId: string) {
    this.taskService.complateTask(uid, taskId);
    this.snackBar.open('お疲れ様でした 🎉');
  }
}
