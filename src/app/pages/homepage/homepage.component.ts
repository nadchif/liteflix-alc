import { UserService } from './../../providers/user.service';
import { MoviedbService } from '../../providers/moviedb.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Movie } from '../../interfaces/movie';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

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
  cachedMoviesInfo: Movie[] = [];
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
        this.cachedMoviesInfo = data;
        this.selection = data.sort(() => Math.random() - Math.random()).slice(0, 5);
        this.refreshFavoritesInfo();
      },
      error => {
        console.log(error as any);
      }
    );

  }

  refreshFavoritesInfo() {
    this.favoritesMovieInfo = this.cachedMoviesInfo.filter((movie) => {
      return this.favorites.includes(movie.id);
    });
  }

  dynamicSort(property) {
    let sortOrder = 1;
    if (property[0] === '-') {
      sortOrder = -1;
      property = property.substr(1);
    }
    return (a, b) => {
      const result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    };
  }

  loadMovieDetails(movieid) {
    this.router.navigateByUrl('/movie/' + movieid);
  }

  sortMovies(property: string) {
    if (property == 'title') {
      if (this.sort == 1) {
        this.movies = this.movies.pipe(map(items => items.sort(this.dynamicSort('-title'))));
        this.sort = -1;
      } else {
        this.movies = this.movies.pipe(map(items => items.sort(this.dynamicSort('title'))));
        this.sort = 1;
      }
    } else if (property == 'popularity') {
      if (this.sort == 2) {
        this.movies = this.movies.pipe(map(items => items.sort(this.dynamicSort('-popularity'))));
        this.sort = -2;
      } else {
        this.movies = this.movies.pipe(map(items => items.sort(this.dynamicSort('popularity'))));
        this.sort = 2;
      }
    }
  }
  toggleFavorite(movie: Movie) {
    this.favorites = this.user.toggleUserFavorite(movie.id);
    this.refreshFavoritesInfo();
  }
  onSelect(movie: Movie) {
    this.router.navigate(['./../movie', movie.id]);
  }
  extractYear(releaseDate: string) {
    return releaseDate.split('-')[0];
  }


}
