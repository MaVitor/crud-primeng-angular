import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router } from "@angular/router"
import { MessageService, ConfirmationService } from "primeng/api"
import { Produto } from "../../models/produto"
import { ProdutoHttpService } from "../../services/produto-http.service"
import { AuthService } from "../../services/auth.service"

// Módulos do PrimeNG
import { TableModule } from "primeng/table"
import { ButtonModule } from "primeng/button"
import { TagModule } from "primeng/tag"
import { ToastModule } from "primeng/toast"
import { ConfirmDialogModule } from "primeng/confirmdialog"
import { TooltipModule } from "primeng/tooltip"
import { CardModule } from "primeng/card"

@Component({
  selector: "app-produto-list-page",
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TagModule,
    ToastModule,
    ConfirmDialogModule,
    TooltipModule,
    CardModule,
  ],
  templateUrl: "./produto-list-page.component.html",
  styleUrls: ["./produto-list-page.component.scss"],
})
export class ProdutoListPageComponent implements OnInit {
  produtos: Produto[] = []
  loading = false

  constructor(
    private produtoHttpService: ProdutoHttpService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.carregarProdutos()
  }

  // Carregar lista de produtos
  carregarProdutos(): void {
    this.loading = true
    this.produtoHttpService.getProdutos().subscribe({
      next: (produtos) => {
        this.produtos = produtos
        this.loading = false
      },
      error: (error) => {
        this.messageService.add({
          severity: "error",
          summary: "Erro",
          detail: "Erro ao carregar produtos",
        })
        this.loading = false
      },
    })
  }

  // Funções para contagem
  getDisponiveisCount(): number {
    return this.produtos.filter((p) => p.disponivel).length
  }

  getIndisponiveisCount(): number {
    return this.produtos.filter((p) => !p.disponivel).length
  }

  // Logout
  onLogout(): void {
    this.authService.logout()
  }

  // Navegar para criação de novo produto
  onCriarProduto(): void {
    this.router.navigate(["/produtos/novo"])
  }

  // Navegar para visualização de detalhes
  onVisualizarProduto(produto: Produto): void {
    this.router.navigate(["/produtos", produto.id, "detalhes"])
  }

  // Navegar para edição de produto
  onEditarProduto(produto: Produto): void {
    this.router.navigate(["/produtos", produto.id, "editar"])
  }

  // Confirmar e excluir produto
  onExcluirProduto(produto: Produto): void {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir o produto "${produto.nome}"?`,
      header: "Confirmar Exclusão",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sim, Excluir",
      rejectLabel: "Cancelar",
      accept: () => {
        if (produto.id) {
          this.produtoHttpService.deleteProduto(produto.id).subscribe({
            next: () => {
              this.messageService.add({
                severity: "success",
                summary: "Sucesso",
                detail: `Produto "${produto.nome}" excluído com sucesso!`,
              })
              this.carregarProdutos()
            },
            error: (error) => {
              this.messageService.add({
                severity: "error",
                summary: "Erro",
                detail: "Erro ao excluir produto",
              })
            },
          })
        }
      },
    })
  }
}
