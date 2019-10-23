import { LoadingIndicatorService } from './loadingIndicatorStatus';
import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { User } from '../interfaces/User';
import { UserService } from './user.service';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
@Injectable()
export class AuthService {
  user: User;
  constructor(
    private ngZone: NgZone,
    private afAuth: AngularFireAuth,
    private router: Router,
    private userservice: UserService,
    private afs: AngularFirestore,
    private loadingIndicator: LoadingIndicatorService
  ) {

  }

  /*
   * login with google
   */
  loginWithGoogle() {

    const provider = new firebase.auth.GoogleAuthProvider();

    this.loadingIndicator.isLoading = true;
    this.afAuth.auth
      .signInWithPopup(provider)
      .then(data => {
        this.updateUserData(data.user);
      })
      .catch(error => {
        console.log(error);
        this.loadingIndicator.isLoading = false;
      });
  }

  logout() {
    this.userservice.clearLocalStorage(); // Optional to clear localStorage
    this.afAuth.auth.signOut().then(() => {
      window.location.reload();
    });
  }

  private updateUserData(user) {
    // Sets user data to firestore on login

    this.loadingIndicator.isLoading = true;
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };
    userRef.set(data, { merge: true });

    this.userservice.setUserLoggedIn(data);

    this.ngZone.run(() => this.router.navigate([''])).then();

    return true;

  }
}
