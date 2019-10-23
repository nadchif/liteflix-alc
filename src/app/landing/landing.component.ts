import { LoadingIndicatorService } from './../providers/loadingIndicatorStatus';
import { MoviedbService } from './../providers/moviedb.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../providers/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.less']
})
export class LandingComponent implements OnInit {
  movies: any;
  selection: any;

  getMovies() {
    this.movies = this.moviesService.getMovies();
    this.movies.subscribe(
      data => {
        console.log(data);
        this.selection = data.sort(() => Math.random() - Math.random()).slice(0, 4);
      },
      error => {
        console.log(error as any);
      }
    );

  }

  constructor(private authservice: AuthService, private router: Router,
              private moviesService: MoviedbService, public loadingIndicator: LoadingIndicatorService) { }
  ngOnInit() {

    if (localStorage.getItem('user')) {
      this.router.navigateByUrl('/');
      return;
    }
    this.getMovies();

  }


  loginWithGoogle() {
    this.authservice.loginWithGoogle();
  }

}
