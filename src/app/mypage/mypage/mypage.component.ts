import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firestore } from 'firebase';
import { take } from 'rxjs/operators';
import { Task } from 'src/app/interfaces/task';
import { AuthService } from 'src/app/services/auth.service';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-mypage',
  templateUrl: './mypage.component.html',
  styleUrls: ['./mypage.component.scss']
})
export class MypageComponent implements OnInit {
  limitTime = 24;
  // userTasks$;
  userTask: Task;
  taskTitleMaxLength = 20;

  form = this.fb.group({
    title: ['', [
      Validators.required,
      Validators.maxLength(this.taskTitleMaxLength)
    ]]
  });

  constructor(
    public authService: AuthService,
    private taskService: TaskService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.authService.afUser$.pipe(take(1)).toPromise().then(user => {
      // this.userTasks$ = this.getTodayTask(user.uid);
    }
    );
  }

  getTodayTask(uid: string) {
    // this.userTasks$ = this.taskService.getTodayTask(uid);
  }

  creatTask(uid: string) {
    this.userTask = {
      id: 'test',
      title: this.form.value.title,
      isComplate: false,
      createdAt: firestore.Timestamp.now()
    };
    this.taskService.createTask(
      uid,
      this.form.value.title
    ).then(() => {
      this.snackBar.open('目標を登録しました！');
    });
  }

  complateTask() {
    this.userTask.isComplate = true;
    this.snackBar.open('お疲れ様でした 🎉');
  }

}
