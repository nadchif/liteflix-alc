import { Injectable } from '@angular/core';
import { Observable, throwError, forkJoin } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Movie } from '../interfaces/movie';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MoviedbService {

  private url = 'https://api.themoviedb.org/3/movie/';
  private searchUrl = 'https://api.themoviedb.org/3/search/movie';
  private apiKey = '68b4fe2a513155a58dd0af4adacb281b';
  private language = 'en';


  constructor(private http: HttpClient) {
  }

  public getMovies(): Observable<Movie[]> {
    const moviesUrl = `${this.url}popular?api_key=${this.apiKey}&language=${this.language}`;
    return this.http.get(moviesUrl)
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }
  // adds movie information to the cache to reduce server requests
  private saveMovieToCache(movie) {

  }
  searchMovies(query: string) {
    const searchUrl = `${this.searchUrl}?api_key=${this.apiKey}&language=${this.language}&query=${query}`;
    return this.http.get(searchUrl).pipe(
      map((res) => {
        this.extractData(res);
        return res;
      })
    );

  }
  getBatchDetails(movieIDs: any[]) {
    // AN EXPENSIVE FUNCTION, use sparingly. unfortunately TMDB does not offer a way to string multiple ids;
    let movieCache = {};
    const movieFetchTasks = [];
    movieIDs.forEach((id, index) => {
      if (index > 25) {
        return; // limit to 25 requests (optional);
      }

      this.getDetails(id).subscribe(data => {
        if (!localStorage.getItem('movies')) {
          console.log('no movies cached yet');
          movieCache[data['id']] = data;
          localStorage.setItem('movies', JSON.stringify(movieCache));
        } else {
          console.log('merge/update cache data');
          movieCache = JSON.parse(localStorage.getItem('movies'));
          movieCache[data['id']] = data;
          localStorage.setItem('movies', JSON.stringify(movieCache));
        }

      });

    });
  }
  getDetails(id: number) {
    const detailsUrl = `${this.url}${id}?api_key=${this.apiKey}&language=${this.language}`;
    return this.http.get(detailsUrl)
      .pipe(map((res) => {
        return res;
      }));
  }
  // get local movie cached data;
  public getCacheMovieData(): any {
    try {
      return JSON.parse(localStorage.getItem('movies'));
    } catch (e) {
      return {};
    }
  }
  private extractData(res) {
    const body = res;

    let data;
    if (body.results != undefined) {
      data = body.results;
    } else {
      data = null;
    }

    if (data != null) {

      try {
        let movieCache = {};

        if (!localStorage.getItem('movies')) {
          console.log('no movies cached yet');
          Object.keys(data).forEach(i => {
            movieCache[data[i].id] = data[i];
          });
          localStorage.setItem('movies', JSON.stringify(movieCache));
        } else {
          console.log('merge/update cache data');
          movieCache = JSON.parse(localStorage.getItem('movies'));
          Object.keys(data).forEach(i => {
            movieCache[data[i].id] = data[i];
          });
          localStorage.setItem('movies', JSON.stringify(movieCache));
        }

      } catch (e) {
        // an error with caching should not halt the program
        console.log('error caching movie info');
      }
    }

    return body.results || {};
  }

  private handleError(err: HttpErrorResponse) {
    // we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }

  // navigate to youtube for movie trailer
  public watchTrailer(movie: Movie) {
    const searchPhrase = encodeURI(`${movie.title} ${movie.release_date.split('-')[0]} Official Trailer`);
    window.location.href = 'https://www.youtube.com/results?search_query=' + searchPhrase;
  }

}
