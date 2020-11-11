import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RestClient {
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

  // todo use interceptor
  private static buildHeaders(headersInit?: HeadersInit): Headers {
    const token = localStorage.getItem('token');
    const headers = new Headers(headersInit);
    if (token) {
      headers.append('Authorization', token);
    }
    return headers;
  }

  public get(url: string): Promise<Response> {
    return RestClient.request(url, {
      method: 'GET',
      headers: RestClient.buildHeaders()
    });
  }

  public post(url: string, payload: object): Promise<Response> {
    return RestClient.request(url, {
      method: 'POST',
      headers: RestClient.buildHeaders({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(payload)
    });
  }

  public put(url: string, payload: object): Promise<Response> {
    return RestClient.request(url, {
      method: 'PUT',
      headers: RestClient.buildHeaders({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(payload)
    });
  }

  public delete(url: string): Promise<Response> {
    return RestClient.request(url, {
      method: 'DELETE',
      headers: RestClient.buildHeaders()
    });
  }
}
