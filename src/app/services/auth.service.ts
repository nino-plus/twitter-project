import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, User } from 'firebase/app';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  afUser$: Observable<User> = this.afAuth.user;
  user: any;
  loginProcessing = false;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private snackBar: MatSnackBar,
    private userService: UserService
  ) {
    this.afUser$.subscribe((user) => {
      this.user = user && user;
    });
  }

  async login(): Promise<void> {
    this.loginProcessing = true;
    const provider = new auth.TwitterAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const userCredential = await this.afAuth.signInWithPopup(provider);
    const { user, additionalUserInfo } = userCredential;
    const { accessToken, secret } = userCredential.credential as any;
    const twitterProfile = additionalUserInfo.profile as any;
    return this.userService
      .getUserData(user.uid)
      .pipe(take(1))
      .toPromise()
      .then((userDoc) => {
        this.router.navigateByUrl('/mypage');
        if (!userDoc) {
          this.userService
            .createUser(user.uid, twitterProfile, accessToken, secret)
            .then(() => {
              this.succeededLogin();
            })
            .catch((error) => {
              this.failedLogin(error);
            });
        }
      });
  }

  succeededLogin() {
    this.snackBar.open('ログインしました。', '閉じる');
    this.loginProcessing = false;
  }

  failedLogin(error: { message: any }) {
    this.loginProcessing = false;
    console.error(error.message);
    this.snackBar.open(
      'ログインエラーです。数秒後にもう一度お試しください。',
      '閉じる'
    );
  }

  async logout(): Promise<void> {
    this.loginProcessing = true;
    return await this.afAuth
      .signOut()
      .then(() => {
        this.router.navigateByUrl('/');
        this.snackBar.open('ログアウトしました。', '閉じる');
        this.loginProcessing = false;
      })
      .catch((error) => {
        this.loginProcessing = false;
        console.error(error.message);
        this.snackBar.open(
          'ログアウトエラーです。数秒後にもう一度お試しください。',
          '閉じる'
        );
      });
  }
}
