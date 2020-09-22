import { Component, Input, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
})
export class HeroComponent implements OnInit {
  @Input() productName: string;
  @Input() limitTime: number;

  user$ = this.authService.afUser$.pipe(tap(() => (this.isLoading = false)));
  isLoading: boolean;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {}

  login() {
    this.authService.loginProcessing = true;
    this.authService.login().finally(() => {
      this.authService.loginProcessing = false;
    });
  }
}
