import { Injectable } from "@angular/core"
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router"
import { AuthService } from "../services/auth.service"
import { MessageService } from "primeng/api"

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
      return true
    }

    // Mostrar mensagem de acesso negado
    this.messageService.add({
      severity: "warn",
      summary: "Acesso Negado",
      detail: "Você precisa estar logado para acessar esta página",
    })

    // Redirecionar para login com a URL de retorno
    this.router.navigate(["/login"], {
      queryParams: { returnUrl: state.url },
    })

    return false
  }
}
