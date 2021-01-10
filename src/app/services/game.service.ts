import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {DomSanitizer, SafeHtml, SafeScript, SafeStyle} from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  public readonly apiUrl: string;
  private reader: FileReader;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
    this.apiUrl = `http://${environment.api_url}/games`;
    this.reader = new FileReader();
  }

  list(): Observable<Array<string>> {
    return this.http.get<Array<string>>(this.apiUrl).pipe(
      catchError((err) => {
        console.error(`error during fetching home: ${err.error.message}`);
        return of([]);
      })
    );
  }

  listStyleUrls(game: string): Observable<Array<SafeStyle>> {
    return this.http.get<Array<string>>(`${this.apiUrl}/${game}/styles`)
      .pipe(
        map(styles => styles.map(style =>
          this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/${game}/files/${style}`))),
        catchError((err) => {
          console.error(`error during fetching home: ${err.error.message}`);
          return of(null);
        })
      );
  }

  listScriptUrls(game: string): Observable<Array<SafeScript>> {
    return this.http.get<Array<string>>(`${this.apiUrl}/${game}/scripts`)
      .pipe(
        map(scripts => scripts.map(script =>
          this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/${game}/files/${script}`))),
        catchError((err) => {
          console.error(`error during fetching home: ${err.error.message}`);
          return of(null);
        })
      );
  }

  downloadHtml(game: string, htmlFile: string): Observable<SafeHtml> {
    const observable = new Observable(subscriber => {
      this.reader.onload = () => {
        if (typeof this.reader.result === 'string') {
          subscriber.next(this.sanitizer.bypassSecurityTrustHtml(this.reader.result));
        }
        subscriber.complete();
      };
    });
    this.http.get(`${this.apiUrl}/${game}/blob/${htmlFile}`, {
      responseType: 'blob'
    }).pipe(
      catchError((err) => {
        console.error(`error during fetching home: ${err.error.message}`);
        return of(null);
      })
    ).subscribe(blob => {
      this.reader.readAsText(blob);
    });
    return observable;
  }

  webhook(game, webhook): Observable<any> {
    return this.http.get(`${this.apiUrl}/${game}/webhooks/${webhook}`).pipe(
      catchError((err) => {
        console.error(`error during fetching home: ${err.error.message}`);
        return of();
      })
    );
  }
}
