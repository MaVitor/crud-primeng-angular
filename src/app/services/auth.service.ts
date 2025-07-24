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
  private apiUrl = "http://localhost:8000/api/auth"; // URL da API de autenticação
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private tokenRefreshTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService,
  ) {
    // CORREÇÃO 1: Lógica de inicialização mais robusta
    // Evita o erro ao ler "undefined" ou JSON inválido do localStorage.
    const storedUser = localStorage.getItem("currentUser");
    let user: User | null = null;

    if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
      try {
        user = JSON.parse(storedUser);
      } catch (error) {
        console.error("Erro ao parsear usuário do localStorage:", error);
        localStorage.removeItem("currentUser"); // Limpa o dado corrompido
      }
    }

    this.currentUserSubject = new BehaviorSubject<User | null>(user);
    this.currentUser = this.currentUserSubject.asObservable();

    // Configurar refresh automático do token se o usuário estiver logado
    if (this.isAuthenticated()) {
      this.startTokenRefreshTimer();
    }
  }

  // Getter para o valor atual do usuário
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // Verificar se o usuário está autenticado
  public isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    // Verificar se o token não expirou
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  // Fazer login
  public login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login/`, credentials).pipe(
      tap((response) => {
        // Armazenar tokens e dados do usuário
        localStorage.setItem("accessToken", response.access);
        localStorage.setItem("refreshToken", response.refresh);

        // CORREÇÃO 2: Verificar se 'response.user' existe antes de salvar
        if (response.user) {
          localStorage.setItem("currentUser", JSON.stringify(response.user));
          // Atualizar o subject
          this.currentUserSubject.next(response.user);
        } else {
          // Caso a API não retorne o usuário, limpamos para não salvar "undefined"
          localStorage.removeItem("currentUser");
          this.currentUserSubject.next(null);
        }

        // Iniciar timer para refresh do token
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

  // Fazer logout
  public logout(): void {
    // Limpar dados do localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("currentUser");

    // Limpar timer de refresh
    this.stopTokenRefreshTimer();

    // Atualizar subject
    this.currentUserSubject.next(null);

    // Redirecionar para login
    this.router.navigate(["/login"]);

    this.messageService.add({
      severity: "info",
      summary: "Logout realizado",
      detail: "Você foi desconectado com sucesso",
    });
  }

  // Obter token de acesso
  public getToken(): string | null {
    return localStorage.getItem("accessToken");
  }

  // Obter token de refresh
  public getRefreshToken(): string | null {
    return localStorage.getItem("refreshToken");
  }

  // Renovar token de acesso
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
        // Se o refresh falhar, fazer logout
        this.logout();
        return throwError(() => error);
      }),
    );
  }

  // Iniciar timer para refresh automático do token
  private startTokenRefreshTimer(): void {
    const token = this.getToken();
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expires = new Date(payload.exp * 1000);
      const timeout = expires.getTime() - Date.now() - 60 * 1000; // Renovar 1 minuto antes de expirar

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

  // Parar timer de refresh do token
  private stopTokenRefreshTimer(): void {
    if (this.tokenRefreshTimer) {
      clearTimeout(this.tokenRefreshTimer);
      this.tokenRefreshTimer = null;
    }
  }

  // Verificar se o usuário tem uma role específica (para futuras implementações)
  public hasRole(role: string): boolean {
    const user = this.currentUserValue;
    // Implementar lógica de roles conforme necessário
    return true;
  }

  // Obter dados do usuário atual
  public getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user/`).pipe(
      tap((user) => {
        // CORREÇÃO 3: Verificação de segurança adicional
        if (user) {
          localStorage.setItem("currentUser", JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
      }),
    );
  }
}