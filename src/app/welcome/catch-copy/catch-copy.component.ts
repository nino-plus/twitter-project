import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-catch-copy',
  templateUrl: './catch-copy.component.html',
  styleUrls: ['./catch-copy.component.scss'],
})
export class CatchCopyComponent implements OnInit {
  @Input() productName: string;

  constructor() {}

  ngOnInit(): void {}
}
