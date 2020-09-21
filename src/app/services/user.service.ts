import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private db: AngularFirestore
  ) { }

  getUserData(uid: string): Observable<any> {
    return this.db.doc(`users/${uid}`).valueChanges();
  }

  async createUser(uid: string, twitterProfile: any): Promise<void> {
    const userData = {
      uid,
      userName: twitterProfile.name,
      avatarURL: twitterProfile.profile_image_url_https.replace('_normal', ''),
      screenName: twitterProfile.screen_name,
    };
    return await this.db.doc(`users/${uid}`).set(userData);
  }
}
