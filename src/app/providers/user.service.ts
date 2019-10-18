import { Injectable, NgZone } from '@angular/core';
import { User } from '../interfaces/User';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(

    public afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,

  ) { }
  // Set data on localStorage
  setUserLoggedIn(user: User) {

    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    userRef.get().subscribe(snapshot => {
      const data = snapshot.data();
      localStorage.setItem('user', JSON.stringify(data));
      console.log('saved on localStorage');
      
      this.router.navigate(['home']);
    });


  }
  // get data on localStorage
  getUserLoggedIn() {
    if (localStorage.getItem('user')) {
      JSON.parse(localStorage.getItem('user'));
    } else {
      console.log('localStorage empty');
    }
  }
  getUserFavorites() {
    if (localStorage.getItem('user')) {
      const favs = JSON.parse(localStorage.getItem('user')).favorites;
      if (favs != undefined) {
        return favs;
      }
      return [];
    } else {
      console.log('localStorage empty');
    }
    return [];
  }
  toggleUserFavorite(movieID: number) {
    if (localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user.favorites != undefined) {
        if (!user.favorites.includes(movieID)) {
          user.favorites.push(movieID);
        } else {
          const index = user.favorites.indexOf(movieID);
          if (index > -1) {
            user.favorites.splice(index, 1);
          }
        }
      } else {
        user['favorites'] = [(movieID)];
      }

      //save to local storage again;
      localStorage.setItem('user', JSON.stringify(user));

      //sync with firestore here;
      const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
      userRef.set(user, { merge: true });

      return user['favorites'];
    } else {
      console.log('localStorage empty');
      return false;
    }

  }
  // clear localStorage
  clearLocalStorage() {
    localStorage.clear();
  }
}
