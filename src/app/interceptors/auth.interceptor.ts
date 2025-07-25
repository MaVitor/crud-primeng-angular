import { Injectable } from "@angular/core"
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from "@angular/common/http"
import { Observable, throwError, BehaviorSubject } from "rxjs"
import { catchError, filter, take, switchMap } from "rxjs/operators"
import { AuthService } from "../services/auth.service"

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null)

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Não interceptar requisições de login/refresh
    if (request.url.includes('/login/') || request.url.includes('/token/refresh/')) {
      return next.handle(request);
    }

    // Adicionar token de autorização se disponível
    const token = this.authService.getToken();
    if (token) {
      request = this.addToken(request, token);
    }

    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(request, next);
        }
        return throwError(() => error);
      }),
    )
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Não tentar refresh token em requisições de login ou refresh
    if (request.url.includes('/login/') || request.url.includes('/token/refresh/')) {
      return throwError(() => new Error('Unauthorized'));
    }

    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false
          this.refreshTokenSubject.next(token.access)
          return next.handle(this.addToken(request, token.access))
        }),
        catchError((err) => {
          this.isRefreshing = false
          this.authService.logout()
          return throwError(() => err)
        }),
      )
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((jwt) => {
          return next.handle(this.addToken(request, jwt))
        }),
      )
    }
  }
}
