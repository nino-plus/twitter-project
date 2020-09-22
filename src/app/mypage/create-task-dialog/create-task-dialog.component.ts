import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TaskService } from 'src/app/services/task.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-task-dialog',
  templateUrl: './create-task-dialog.component.html',
  styleUrls: ['./create-task-dialog.component.scss']
})
export class CreateTaskDialogComponent implements OnInit {
  taskTitleMaxLength = 20;

  form = this.fb.group({
    title: ['', [
      Validators.required,
      Validators.maxLength(this.taskTitleMaxLength)
    ]]
  });

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data,
    private dialogRef: MatDialogRef<CreateTaskDialogComponent>,
    private fb: FormBuilder,
    private taskService: TaskService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  creatTask() {
    this.taskService.createTask(
      this.data.uid,
      this.form.value.title
    ).then(() => {
      this.snackBar.open('目標を登録しました！');
      this.dialogRef.close();
    });
  }

}
