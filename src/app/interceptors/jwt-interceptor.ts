import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from '../services/auth.service';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const jwt = localStorage.getItem(AuthService.STORAGE_TOKEN);
    if (jwt) {
      return next.handle(req.clone({setHeaders: { Authorization: jwt }}));
    }
    return next.handle(req);
  }
}
