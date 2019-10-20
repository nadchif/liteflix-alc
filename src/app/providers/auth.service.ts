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
    public afAuth: AngularFireAuth,
    private router: Router,
    public userservice: UserService,
    private afs: AngularFirestore,
    private loadingIndicator: LoadingIndicatorService
  ) {
    this.checkLocalStorage();
  }
  /*
   * If localStoge is empty, we call getDataFromFirebase
   * method set user data from firebase on localStorage
   */
  checkLocalStorage() {
    if (!localStorage.getItem('user')) {
      this.getDataFromFirebase();
    } else {
      console.log('localStorage ready!');
    }
  }
  /*
   * Call data from firebase and set data on local storage
   */
  getDataFromFirebase() {
    this.loadingIndicator.isLoading = true;
    this.afAuth.authState.subscribe(auth => {
      if (auth) {
        this.user = auth; // save data firebase on user
        console.log('Authenticated'); // set user data from firebase on local storage
        this.loadingIndicator.isLoading = false;
      } else {
        console.log('Not authenticated');
        this.loadingIndicator.isLoading = false;
      }
    });


  }
  /*
   * login with google
   */
  loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    this.afAuth.auth
      .signInWithPopup(provider)
      .then(data => {
        this.loadingIndicator.isLoading = true;
        this.updateUserData(data.user);
      })
      .catch(error => {
        console.log(error);
      });
  }
  /*
   * logout
   */
  logout() {
    this.userservice.clearLocalStorage(); // Optional to clear localStorage
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['login']);
    });
  }

  private updateUserData(user) {
    // Sets user data to firestore on login

    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };
    userRef.set(data, { merge: true });

    this.userservice.setUserLoggedIn(data);

    this.loadingIndicator.isLoading = false;

    this.ngZone.run(() => this.router.navigate(['dashboard'])).then();

    return true;

  }
}
