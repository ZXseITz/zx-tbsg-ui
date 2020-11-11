import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RestClient {
  public authToken: string;

  constructor() {
    this.authToken = undefined;
  }

  private static request(url: string, init: object): Promise<Response> {
    return fetch(url, init)
      .then(res => {
        if (!res.ok) {
          // console.error(`server responded with status code ${res.status}`);
          return res.text().then(errorMessage => {
            throw errorMessage;
          });
        }
        return res;
      });
  }

  private buildHeaders(headersInit?: HeadersInit): Headers {
    const headers = new Headers(headersInit);
    if (this.authToken !== undefined) {
      headers.append('Authorization', this.authToken);
    }
    return headers;
  }

  public get(url: string): Promise<Response> {
    return RestClient.request(url, {
      method: 'GET',
      headers: this.buildHeaders()
    });
  }

  public post(url: string, payload: object): Promise<Response> {
    return RestClient.request(url, {
      method: 'POST',
      headers: this.buildHeaders({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(payload)
    });
  }

  public put(url: string, payload: object): Promise<Response> {
    return RestClient.request(url, {
      method: 'PUT',
      headers: this.buildHeaders({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(payload)
    });
  }

  public delete(url: string): Promise<Response> {
    return RestClient.request(url, {
      method: 'DELETE',
      headers: this.buildHeaders()
    });
  }
}
