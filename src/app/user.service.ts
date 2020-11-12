import {Injectable} from '@angular/core';
import {RestClient} from './rest-client.service';
import {environment} from '../environments/environment';
import {User} from './user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl: string;

  constructor(private rest: RestClient) {
    this.apiUrl = `http://${environment.api_url}/user`;
  }

  async loadUser(userid: string): Promise<User> {
    const res = await this.rest.get(`${this.apiUrl}/${userid}`);
    return  await res.json() as User;
  }
}
