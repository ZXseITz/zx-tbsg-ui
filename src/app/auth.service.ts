import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';
import {RestClient} from './rest-client.service';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl: string;

  constructor(private rest: RestClient) {
    this.apiUrl = `http://${environment.api_url}/auth`;
  }

  async register(username: string, email: string, password: string): Promise<void> {
    await this.rest.post(`${this.apiUrl}/register`, {
      username,
      email,
      password,
    });
  }

  async login(username: string, password: string): Promise<void> {
    const res = await this.rest.post(`${this.apiUrl}/login`, {
      username,
      password,
    });
    const body = await res.json();
    // todo handle expiration
    const jwt = body.jwt;
    const dec = jwt_decode(jwt) as { sub: string, exp: number };
    localStorage.setItem('userid', dec.sub);
    localStorage.setItem('expired', `${dec.exp}`);
    localStorage.setItem('token', `Bearer ${body.jwt}`);
  }
}
