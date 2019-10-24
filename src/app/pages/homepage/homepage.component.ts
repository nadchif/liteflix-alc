import { UserService } from './../../providers/user.service';
import { MoviedbService } from '../../providers/moviedb.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Movie } from '../../interfaces/movie';
import { Observable } from 'rxjs';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.less']
})
export class HomepageComponent implements OnInit {
  @ViewChild(CdkVirtualScrollViewport, { static: false })
  viewport: CdkVirtualScrollViewport;
  @ViewChild('userFavorites', { static: false })
  viewport2: CdkVirtualScrollViewport;

  movies: Observable<Movie[]>;
  favorites = [];
  favoritesMovieInfo: Movie[] = [];
  selection: Movie[] = [];
  cachedMoviesInfo = this.moviesService.getCacheMovieData();
  language: string;
  sort: number;
  currentScrollPos = 0;
  currentFavsScrollPos = 0;


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

  scrollCarousel(amt) {

    if ((this.currentScrollPos) > this.viewport.getDataLength()) {
      return;
    }
    if (this.currentScrollPos < 0 ) {
      this.currentScrollPos = 0;
    }
    this.currentScrollPos += amt;
    this.viewport.scrollToIndex(this.currentScrollPos);
  }
  scrollFavsCarousel(amt) {

    if ((this.currentFavsScrollPos) > this.viewport.getDataLength()) {
      return;
    }
    if (this.currentFavsScrollPos < 0 ) {
      this.currentFavsScrollPos = 0;
    }
    this.currentFavsScrollPos += amt;

    this.viewport2.scrollToIndex(this.currentFavsScrollPos);
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
