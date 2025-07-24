import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { MenuItem } from "primeng/api";
import { Subscription } from "rxjs";
import { AuthService } from "../../services/auth.service";
import { User } from "../../models/auth";

// Módulos do PrimeNG
import { ToolbarModule } from "primeng/toolbar";
import { MenubarModule } from "primeng/menubar";
import { ButtonModule } from "primeng/button";
import { MenuModule } from "primeng/menu";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, RouterModule, ToolbarModule, MenubarModule, ButtonModule, MenuModule],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit, OnDestroy {
  items: MenuItem[] = [];
  userMenuItems: MenuItem[] = [];
  currentUser: User | null = null;
  isAuthenticated = false;
  private authSubscription!: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    // Escuta as mudanças no estado de autenticação do AuthService
    this.authSubscription = this.authService.currentUser.subscribe((user) => {
      this.currentUser = user;
      this.isAuthenticated = !!user; // true se 'user' não for null, false se for
      this.setupMenus(); // Reconfigura os menus sempre que o status de login muda
    });
  }

  ngOnDestroy() {
    // Evita memory leaks ao destruir o componente
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  private setupMenus() {
    // Menu principal (só aparece quando logado)
    if (this.isAuthenticated) {
      this.items = [
        {
          label: "Produtos",
          icon: "pi pi-box",
          routerLink: "/produtos",
        },
      ];

      // Menu do usuário (só aparece quando logado)
      this.userMenuItems = [
        {
          label: "Perfil",
          icon: "pi pi-user",
          // Adicionar comando se houver uma página de perfil
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
      ];
    } else {
      // Se não estiver logado, limpa os menus
      this.items = [];
      this.userMenuItems = [];
    }
  }

  // Navegar para a página inicial
  navigateHome() {
    this.router.navigate(['/']);
  }

  // Navegar para login
  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  // Fazer logout
  logout() {
    this.authService.logout();
  }
}