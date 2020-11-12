import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';
import {User} from './user';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `http://${environment.api_url}/user`;
  }

  loadUser(userid: string): Observable<User> {
    return  this.http.get<User>(`${this.apiUrl}/${userid}`);
  }
}
