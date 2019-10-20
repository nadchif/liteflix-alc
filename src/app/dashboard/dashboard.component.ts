import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { User } from 'firebase';
import { AuthService } from '../providers/auth.service';
import { Router, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { MatSidenav } from '@angular/material';
import { UserService } from '../providers/user.service';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {

  isLoading = false;
  user: User;
  searchQuery = '';
  constructor(
    public authservice: AuthService,
    private router: Router,
    public userProfile: UserService
  ) {
  }
  ngOnInit() {

    this.getUserLoggedIn();

    if (!localStorage.getItem('user')) {
      this.router.navigate(['landing']);
    };


    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isLoading = true;
      }

      if (event instanceof NavigationEnd) {
        // Hide loading indicator
        this.isLoading = false;
      }

      if (event instanceof NavigationError) {
        // Hide loading indicator
        // Present error to user
        this.isLoading = false;
        console.log(event.error);
      }
    });
  }

  navToSearch() {

    this.router.navigateByUrl(`/find/${encodeURI(this.searchQuery)}`);

  }
  getUserLoggedIn() {
    this.user = JSON.parse(localStorage.getItem('user'));
  }
  logout() {
    this.authservice.logout();
    this.router.navigate(['landing']);
  }


}
