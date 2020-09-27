import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  productName = '爆つい';
  limitTime = 24;

  constructor() {}

  ngOnInit(): void {}
}
