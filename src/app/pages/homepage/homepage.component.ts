import { UserService } from './../../providers/user.service';
import { MoviedbService } from '../../providers/moviedb.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Movie } from '../../interfaces/movie';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.less']
})
export class HomepageComponent implements OnInit {
  movies: Observable<Movie[]>;
  favorites = [];
  favoritesMovieInfo: Movie[] = [];
  selection: Movie[] = [];
  cachedMoviesInfo = this.moviesService.getCacheMovieData();
  language: string;
  sort: number;

  constructor(
    public moviesService: MoviedbService,
    private router: Router,
    private user: UserService
  ) { }

  ngOnInit() {
    this.language = 'en';
    this.getMovies();
    this.getFavorites();
  }
  getFavorites() {
    this.favorites = this.user.getUserFavorites();
  }
  getMovies() {
    this.movies = this.moviesService.getMovies();
    this.movies.subscribe(
      data => {
        // this.cachedMoviesInfo = data; //deprecated
        this.selection = data.sort(() => Math.random() - Math.random()).slice(0, 5);
        this.refreshFavoritesInfo();
      },
      error => {
        console.log(error as any);
      }
    );

  }
  // create an array of movie info of the user's favorites by filtering the movies in the movie service cache
  refreshFavoritesInfo() {
    const cachedData = Object.values(this.moviesService.getCacheMovieData()) as Movie[];
    this.favoritesMovieInfo = cachedData.filter((movie) => {
      return this.favorites.includes(movie.id);
    });
  }

  // navigate to movie details page
  loadMovieDetails(movieid) {
    this.router.navigateByUrl('/movie/' + movieid);
  }

  toggleFavorite(movie: Movie) {
    this.favorites = this.user.toggleUserFavorite(movie.id); // User service to toggle favorites
    this.refreshFavoritesInfo(); // update the UI favorites part;
  }
  // used to return just the year from the movie infomation
  extractYear(releaseDate: string) {
    return releaseDate.split('-')[0];
  }
}
