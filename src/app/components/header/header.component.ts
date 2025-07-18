import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { MenuItem } from "primeng/api";

// Módulos do PrimeNG
import { ToolbarModule } from "primeng/toolbar";
import { MenubarModule } from "primeng/menubar";
import { ButtonModule } from "primeng/button";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ToolbarModule,
    MenubarModule,
    ButtonModule,
  ],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  items: MenuItem[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    // Configuração do menu de navegação
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
    ];
  }

  // Navegar para a página inicial
  navigateHome() {
    this.router.navigate(["/produtos"]);
  }
}
