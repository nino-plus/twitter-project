import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firestore } from 'firebase';
import { take } from 'rxjs/operators';
import { Task } from 'src/app/interfaces/task';
import { AuthService } from 'src/app/services/auth.service';
import { TaskService } from 'src/app/services/task.service';
import { CreateTaskDialogComponent } from '../create-task-dialog/create-task-dialog.component';

@Component({
  selector: 'app-mypage',
  templateUrl: './mypage.component.html',
  styleUrls: ['./mypage.component.scss']
})
export class MypageComponent implements OnInit {
  limitTime = 24;
  // userTasks$;
  userTask: Task = {
    id: 'test',
    title: 'Noteを書く。',
    isComplate: false,
    createdAt: firestore.Timestamp.now()
  };

  constructor(
    public authService: AuthService,
    private taskService: TaskService,
    private dialog: MatDialog,
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

  complateTask() {
    this.userTask.isComplate = true;
    console.log(this.userTask);
  }

  openCreateTaskDialog(uid: string) {
    this.dialog.open(CreateTaskDialogComponent, {
      width: '560px',
      autoFocus: false,
      restoreFocus: false,
      data: { uid }
    });
  }

}
