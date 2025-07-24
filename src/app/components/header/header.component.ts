import { Component, OnInit, OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router, RouterModule } from "@angular/router"
import { MenuItem } from "primeng/api"
import { Subscription } from "rxjs"
import { AuthService } from "../../services/auth.service"
import { User } from "../../models/auth"

// Módulos do PrimeNG
import { ToolbarModule } from "primeng/toolbar"
import { MenubarModule } from "primeng/menubar"
import { ButtonModule } from "primeng/button"
import { MenuModule } from "primeng/menu"

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, RouterModule, ToolbarModule, MenubarModule, ButtonModule, MenuModule],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit, OnDestroy {
  items: MenuItem[] = []
  userMenuItems: MenuItem[] = []
  currentUser: User | null = null
  isAuthenticated = false
  private authSubscription: Subscription = new Subscription()

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    // Observar mudanças no estado de autenticação
    this.authSubscription = this.authService.currentUser.subscribe((user) => {
      this.currentUser = user
      this.isAuthenticated = !!user
      this.setupMenus()
    })
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe()
  }

  private setupMenus() {
    // Menu principal (apenas para usuários autenticados)
    if (this.isAuthenticated) {
      this.items = [
        {
          label: "Produtos",
          icon: "pi pi-box",
          items: [
            {
              label: "Listar Produtos",
              icon: "pi pi-list",
              command: () => this.router.navigate(["/produtos"]),
            },
            {
              label: "Novo Produto",
              icon: "pi pi-plus",
              command: () => this.router.navigate(["/produtos/novo"]),
            },
          ],
        },
      ]

      // Menu do usuário
      this.userMenuItems = [
        {
          label: "Perfil",
          icon: "pi pi-user",
          command: () => {
            // Implementar navegação para perfil se necessário
            console.log("Navegar para perfil")
          },
        },
        {
          label: "Configurações",
          icon: "pi pi-cog",
          command: () => {
            // Implementar navegação para configurações se necessário
            console.log("Navegar para configurações")
          },
        },
        {
          separator: true,
        },
        {
          label: "Sair",
          icon: "pi pi-sign-out",
          styleClass: "logout-item",
          command: () => this.logout(),
        },
      ]
    } else {
      this.items = []
      this.userMenuItems = []
    }
  }

  // Navegar para a página inicial
  navigateHome() {
    if (this.isAuthenticated) {
      this.router.navigate(["/produtos"])
    } else {
      this.router.navigate(["/login"])
    }
  }

  // Navegar para login
  navigateToLogin() {
    this.router.navigate(["/login"])
  }

  // Fazer logout
  logout() {
    this.authService.logout()
  }
}
