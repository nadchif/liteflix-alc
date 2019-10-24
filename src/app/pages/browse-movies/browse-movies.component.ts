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
  currentPage = 1;
  pageSize = 20;
  resultsCount = 1;

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
  OnPageChange(event) {
    window.scroll(0, 0);
    if((event.pageIndex + 1) > this.currentPage){
    this.getAllMovies(event.pageIndex + 1);
    }
  }
  getAllMovies(page?: number) {
    let idx;
    if (page > 0) {
      idx = page;
    } else {
      idx = 1;
    }
    this.moviesService.getAllMovies(idx).subscribe(
      data => {
        this.currentPage = (idx-1);
        this.resultsCount = data.resultsCount;
        this.displayMovies = this.displayMovies.concat(data.results);
        this.pageSize = data.itemsPerPage;
        this.dataLoaded = true;
        return;
      },
      error => {
        console.log(error as any);
        this.dataLoaded = true;
      }
    );
  }
  getMovies(query = null) {

    if (
      this.activeMode.toLowerCase() == 'recommended' || this.activeMode.toLowerCase() == 'favorites') {
      this.movies = this.moviesService.getMovies();
    }

    if (this.activeMode.toLowerCase() == 'all') {
      this.getAllMovies(1);
      return;
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
        if (this.activeMode.toLowerCase() == 'recommended') {
          this.displayMovies = this.cachedMoviesInfo;
        }
        if (this.activeMode.toLowerCase() == 'all') {
          this.displayMovies = Object.values(this.moviesService.getCacheMovieData()) as Movie[];
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

    this.dataLoaded = false;
    this.router.navigateByUrl(`/find/${this.searchQuery}`);

  }
  refreshFavoritesInfo() {
    if (this.activeMode.toLowerCase() == 'favorites') {
      const cachedData = Object.values(this.moviesService.getCacheMovieData()) as Movie[];
      this.displayMovies = cachedData.filter((movie) => {
        return this.favorites.includes(movie.id);
      });
    }

  }

  loadMovieDetails(movieid) {
    this.router.navigateByUrl('/movie/' + movieid);
  }

  toggleFavorite(movie: Movie) {
    this.favorites = this.user.toggleUserFavorite(movie.id);
    this.refreshFavoritesInfo();
  }

  extractYear(releaseDate: string) {
    return releaseDate.split('-')[0];
  }


}
