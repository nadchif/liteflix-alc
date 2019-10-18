import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../providers/auth.service';
import { UserService } from './../../providers/user.service';
import { User } from 'firebase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.less']
})
export class NavbarComponent implements OnInit {
  user: User;
  constructor(
    public authservice: AuthService, private router: Router, public userProfile: UserService
  ) {
    this.getUserLoggedIn();
  }
  ngOnInit() {
    if (!localStorage.getItem('user')) {
      this.router.navigate(['landing']);
    }
  }
  getUserLoggedIn() {
    this.user = JSON.parse(localStorage.getItem('user'));
  }
  logout() {
    this.authservice.logout();
    this.router.navigate(['landing']);
  }

}
