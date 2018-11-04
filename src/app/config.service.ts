import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  baseUrl: string = '/red-ampp/api/';

  constructor(
    private http: HttpClient,
  ) { }

  private handleError( error: HttpErrorResponse ) {

    if( error.error instanceof ErrorEvent ) {
      console.error( 'an error occurred', error.error.message );
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was ${error.error}`
      );
    }

    return throwError( 'Something bad happened: please try again later' );
  }

  getRoutes() {
    return this.get( 'getRoutes' );
  }

  get( action: string ) {
    return this.http.get( this.baseUrl + action, httpOptions )
      .pipe(
        catchError( this.handleError )
      )
  }

  post( action: string, redirect ) {
    return this.http.post( this.baseUrl + action, redirect, httpOptions )
      .pipe(
        catchError( this.handleError )
      );
  }

}
