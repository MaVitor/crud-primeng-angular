import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { Router, ActivatedRoute } from "@angular/router"
import { AuthService } from "../../services/auth.service"
import { LoginRequest } from "../../models/auth"

// Módulos do PrimeNG
import { ButtonModule } from "primeng/button"
import { InputTextModule } from "primeng/inputtext"
import { PasswordModule } from "primeng/password"
import { ToastModule } from "primeng/toast"

@Component({
  selector: "app-login-page",
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, PasswordModule, ToastModule],
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.scss"],
})
export class LoginPageComponent implements OnInit {
  credentials: LoginRequest = {
    username: "",
    password: "",
  }

  loading = false
  returnUrl = "/produtos"

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    // Obter URL de retorno dos parâmetros da query
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/produtos"

    // Se já estiver logado, redirecionar
    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.returnUrl])
    }
  }

  onLogin(): void {
    if (!this.credentials.username || !this.credentials.password) {
      return
    }

    this.loading = true

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.loading = false
        // Redirecionar para a URL de retorno ou produtos
        this.router.navigate([this.returnUrl])
      },
      error: (error) => {
        this.loading = false
        console.error("Erro no login:", error)
      },
    })
  }
}
