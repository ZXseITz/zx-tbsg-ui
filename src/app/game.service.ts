import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';
import {RestClient} from './rest-client.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly apiUrl: string;

  constructor(private restClient: RestClient) {
    // todo: fix url
    this.apiUrl = `http://${environment.api_url}/test/hello`;
  }

  async home(): Promise<string> {
    const res = await this.restClient.get(this.apiUrl);
    return await res.text();
  }
}
