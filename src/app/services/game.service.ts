import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly apiUrl: string;

  constructor(private http: HttpClient) {
    // todo: fix url
    this.apiUrl = `http://${environment.api_url}/test/hello`;
  }

  home(): Observable<string> {
    return this.http.get(this.apiUrl, {
      responseType: 'text'
    }).pipe(
      catchError((err) => {
        console.error(`error during fetching home: ${err.error.message}`);
        return of('restricted');
      })
    );
  }
}
