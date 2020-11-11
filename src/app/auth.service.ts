import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';
import {RestClient} from './rest-client.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl: string;
  public jwt: string;

  constructor(private rest: RestClient) {
    this.apiUrl = `http://${environment.api_url}/auth`;
    this.jwt = undefined;
  }

  async register(username: string, email: string, password: string): Promise<void> {
    await this.rest.post(`${this.apiUrl}/register`, {
      username,
      email,
      password,
    });
  }

  async login(username: string, password: string): Promise<void> {
    await this.rest.post(`${this.apiUrl}/login`, {
      username,
      password,
    }).then(res => res.json()).then(body => {
      this.rest.authToken = body.jwt;
    });
  }
}
