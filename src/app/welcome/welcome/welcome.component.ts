import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  productName = 'Twitter Project';
  limitTime = 24;

  constructor() {}

  ngOnInit(): void {}
}
