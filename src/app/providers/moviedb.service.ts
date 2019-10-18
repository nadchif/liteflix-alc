import { Injectable } from '@angular/core';
import { Observable, pipe, throwError } from 'rxjs';
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
  private language;

  constructor(private http: HttpClient) {

    this.language = 'en';
  }

  public getMovies(): Observable<Movie[]> {
    const moviesUrl = `${this.url}popular?api_key=${this.apiKey}&language=${this.language}`;

    return this.http.get(moviesUrl)
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }




  searchMovies(query: string) {
    const searchUrl = `${this.searchUrl}?api_key=${this.apiKey}&language=${this.language}&query=${query}`;

    return this.http.get(searchUrl).pipe(
      map((res) => res)
    );

  }



  

  getDetails(id: number) {
    const detailsUrl = `${this.url}${id}?api_key=${this.apiKey}&language=${this.language}`;

    return this.http.get(detailsUrl)
      .pipe(map((res) => res));
  }

  changeLanguage(lang: string) {
    localStorage.setItem('lang', lang);
    this.language = lang;
  }

  getLanguage() {
    return this.language;
  }

  private extractData(res: Response) {
    const body = res;
    return body['results'] || {};
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

  public watchTrailer(movie: Movie) {
    const searchPhrase = `${movie.title} ${movie.release_date.split('-')[0]} Official Trailer`
    window.location.href = 'https://www.youtube.com/results?search_query=' + searchPhrase;
  }

}
