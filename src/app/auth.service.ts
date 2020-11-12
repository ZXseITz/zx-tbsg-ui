import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';
import jwt_decode from 'jwt-decode';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public static readonly STORAGE_TOKEN = 'token';
  public static readonly STORAGE_USER_ID = 'userid';
  public static readonly STORAGE_TOKEN_EXPIRED = 'expired';

  private readonly apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `http://${environment.api_url}/auth`;
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, {
      username,
      email,
      password,
    });
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<{jwt}>(`${this.apiUrl}/login`, {
      username,
      password,
    }).pipe(
      map(body => {
        const dec = jwt_decode(body.jwt) as {sub: string, exp: number};
        localStorage.setItem(AuthService.STORAGE_USER_ID, dec.sub);
        localStorage.setItem(AuthService.STORAGE_TOKEN_EXPIRED, `${dec.exp}`);
        localStorage.setItem(AuthService.STORAGE_TOKEN, `Bearer ${body.jwt}`);
      })
    );
  }
}
