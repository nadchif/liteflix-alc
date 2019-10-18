import { Component, OnInit } from '@angular/core';
import { MoviedbService } from 'src/app/providers/moviedb.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/providers/user.service';
import { Observable } from 'rxjs';
import { Movie } from 'src/app/interfaces/movie';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-browse-movies',
  templateUrl: './browse-movies.component.html',
  styleUrls: ['./browse-movies.component.less']
})
export class BrowseMoviesComponent implements OnInit {

  activeMode = '';
  acceptableModes = ['all', 'recommended', 'favorites', 'search'];
  dataLoaded = false;
  movies: Observable<any>;
  favorites = [];
  favoritesMovieInfo: Movie[] = [];
  displayMovies: Movie[] = [];
  cachedMoviesInfo: Movie[] = [];
  language: string;
  sort: number;
  movie = false;
  movieData: any;
  searchQuery = '';

  constructor(
    public moviesService: MoviedbService,
    private router: Router,
    private user: UserService,
    private route: ActivatedRoute,
  ) {


  }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        let section = params.mode;
        const query = params.query;
        if (query) {
          this.activeMode = 'find';
          if (query.toLowerCase() != 'newsearch') {
            this.searchQuery = query;
          }

          this.getMovies(query);
          return;
        }
        if (section) {
          if (!this.acceptableModes.includes(section.toLowerCase())) {
            section = 'all';
          }
          this.activeMode = section;
          this.getMovies();
        }
      })
      ;
    this.language = 'en';
  }

  getFavorites() {
    this.favorites = this.user.getUserFavorites();
    this.refreshFavoritesInfo();
  }
  getMovies(query = null) {

    if (this.activeMode.toLowerCase() == 'recommended' || this.activeMode.toLowerCase() == 'favorites') {
      this.movies = this.moviesService.getMovies();
    }

    if (this.activeMode == 'find') {
      if (query.toLowerCase() == 'newsearch') {
        this.dataLoaded = true;
        return;
      }
      this.movies = this.moviesService.searchMovies(query);
    }
    if (this.movies == undefined) {
      this.dataLoaded = true;
      return;
    }

    this.movies.subscribe(
      data => {
        this.cachedMoviesInfo = data;
        this.getFavorites();
        if (this.activeMode.toLowerCase() == 'recommended' || this.activeMode.toLowerCase() == 'all') {
          this.displayMovies = this.cachedMoviesInfo;
        }
        if (this.activeMode == 'find') {
          this.displayMovies = data['results'];
        }
        this.dataLoaded = true;
      },
      error => {
        console.log(error as any);
      }
    );

  }
navToSearch() {

  this.router.navigateByUrl(`/find/${this.searchQuery}`);

}
  refreshFavoritesInfo() {
    if (this.activeMode.toLowerCase() == 'favorites') {
      this.displayMovies = this.cachedMoviesInfo.filter((movie) => {
        return this.favorites.includes(movie.id);
      });
    }

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
