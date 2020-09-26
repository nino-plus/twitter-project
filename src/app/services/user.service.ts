import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { Token } from '../interfaces/token';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private db: AngularFirestore) {}

  getUserData(uid: string): Observable<any> {
    return this.db.doc(`users/${uid}`).valueChanges();
  }

  async createUser(
    uid: string,
    twitterProfile: any,
    accessToken: string,
    secret: string
  ): Promise<void> {
    const userData: User = {
      uid,
      userName: twitterProfile.name,
      avatarURL: twitterProfile.profile_image_url_https.replace('_normal', ''),
    };
    const tokenData: Token = {
      uid,
      twitterUid: twitterProfile.id_str,
      access_token_key: accessToken,
      access_token_secret: secret,
    };
    await this.db.doc(`users/${uid}`).set(userData);
    await this.db.doc(`private/${uid}`).set(tokenData);
  }
}
