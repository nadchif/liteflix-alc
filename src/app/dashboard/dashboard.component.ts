import { Component, OnInit } from '@angular/core';
import { User } from 'firebase';
import { AuthService } from '../providers/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {
  user: User;
  searchQuery = '';
  constructor(
    public authservice: AuthService, private router: Router
  ) {
    this.getUserLoggedIn();
  }
  ngOnInit() {
    if (!localStorage.getItem('user')) {
      this.router.navigate(['landing']);
    }
  }

navToSearch() {

  this.router.navigateByUrl(`/find/${this.searchQuery}`);

}
  getUserLoggedIn() {
    this.user = JSON.parse(localStorage.getItem('user'));
  }
  logout() {
    this.authservice.logout();
    this.router.navigate(['landing']);
  }


}
