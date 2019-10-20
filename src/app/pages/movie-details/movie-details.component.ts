import { Component, OnInit, Input } from '@angular/core';
import { MoviedbService } from 'src/app/providers/moviedb.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/providers/user.service';
import { Movie } from 'src/app/interfaces/movie';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.less']
})
export class MovieDetailsComponent implements OnInit {
  movie = false;
  movieData: any;
  favorites = [];
  constructor(
    public moviesService: MoviedbService,
    private router: Router,
    private user: UserService,
    private route: ActivatedRoute,
  ) {
    this.route.params.subscribe(
      params => {
        const id = params['movieid'];
        if (id) {this.getDetails(id);
        }
      });

  }


  getDetails(id) {
    this.moviesService.getDetails(id).subscribe(
      data => {
        //console.log(data);
        this.movieData = data;
        this.movie = true;
      },
      error => {
        console.log(error as any);
      }
    );
    this.getFavorites();
  }


  toggleFavorite(movie) {
    this.favorites = this.user.toggleUserFavorite(movie.id);
  }

  async getFavorites() {
    this.favorites = await this.user.getUserFavorites();
  }
  navBack() {
    window.history.back();
  }
  ngOnInit() {
  }

}
