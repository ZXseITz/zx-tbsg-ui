import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

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
    });
  }
}
