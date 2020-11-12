import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {User} from '../models/user';
import {Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `http://${environment.api_url}/user`;
  }

  loadUser(userid: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userid}`)
      .pipe(
        catchError((err) => {
          console.error(`error during loading user ${userid}: ${err.error.message}`);
          return of({username: 'n/a', email: 'n/a'});
        })
      );
  }
}
