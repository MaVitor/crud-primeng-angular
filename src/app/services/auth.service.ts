import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { LoginRequest, LoginResponse, User, RefreshTokenRequest, RefreshTokenResponse } from "../models/auth";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  // CORREÇÃO: URL da API dinâmica para funcionar no Codespace e localmente
  private apiUrl = `${window.location.protocol}//${window.location.hostname.replace('4200', '8000')}/api/auth`;
  
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private tokenRefreshTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService,
  ) {
    // Lógica de inicialização robusta do localStorage
    const storedUser = localStorage.getItem("currentUser");
    let user: User | null = null;

    if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
      try {
        user = JSON.parse(storedUser);
      } catch (error) {
        console.error("Erro ao parsear usuário do localStorage:", error);
        localStorage.removeItem("currentUser");
      }
    }

    this.currentUserSubject = new BehaviorSubject<User | null>(user);
    this.currentUser = this.currentUserSubject.asObservable();

    if (this.isAuthenticated()) {
      this.startTokenRefreshTimer();
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  public login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login/`, credentials).pipe(
      tap((response) => {
        localStorage.setItem("accessToken", response.access);
        localStorage.setItem("refreshToken", response.refresh);

        if (response.user) {
          localStorage.setItem("currentUser", JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        } else {
          localStorage.removeItem("currentUser");
          this.currentUserSubject.next(null);
        }

        this.startTokenRefreshTimer();

        if (response.user) {
          this.messageService.add({
            severity: "success",
            summary: "Login realizado",
            detail: `Bem-vindo, ${response.user.first_name || response.user.username}!`,
          });
        }
      }),
      catchError((error) => {
        this.messageService.add({
          severity: "error",
          summary: "Erro no login",
          detail: "Credenciais inválidas",
        });
        return throwError(() => error);
      }),
    );
  }

  public logout(): void {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("currentUser");
    this.stopTokenRefreshTimer();
    this.currentUserSubject.next(null);
    this.router.navigate(["/login"]);
    this.messageService.add({
      severity: "info",
      summary: "Logout realizado",
      detail: "Você foi desconectado com sucesso",
    });
  }

  public getToken(): string | null {
    return localStorage.getItem("accessToken");
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem("refreshToken");
  }

  public refreshToken(): Observable<RefreshTokenResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error("No refresh token available"));
    }
    const request: RefreshTokenRequest = { refresh: refreshToken };
    return this.http.post<RefreshTokenResponse>(`${this.apiUrl}/token/refresh/`, request).pipe(
      tap((response) => {
        localStorage.setItem("accessToken", response.access);
        this.startTokenRefreshTimer();
      }),
      catchError((error) => {
        this.logout();
        return throwError(() => error);
      }),
    );
  }

  private startTokenRefreshTimer(): void {
    const token = this.getToken();
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expires = new Date(payload.exp * 1000);
      const timeout = expires.getTime() - Date.now() - 60 * 1000;
      if (timeout > 0) {
        this.tokenRefreshTimer = setTimeout(() => {
          this.refreshToken().subscribe({
            error: () => this.logout(),
          });
        }, timeout);
      }
    } catch (error) {
      console.error("Erro ao processar token:", error);
    }
  }

  private stopTokenRefreshTimer(): void {
    if (this.tokenRefreshTimer) {
      clearTimeout(this.tokenRefreshTimer);
      this.tokenRefreshTimer = null;
    }
  }

  public hasRole(role: string): boolean {
    const user = this.currentUserValue;
    return true;
  }

  public getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user/`).pipe(
      tap((user) => {
        if (user) {
          localStorage.setItem("currentUser", JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
      }),
    );
  }
}