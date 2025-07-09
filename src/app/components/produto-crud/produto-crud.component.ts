import { Component, OnInit, Output, EventEmitter } from "@angular/core"
import { MessageService } from "primeng/api"
import { Produto } from "../../models/produto"
import { ProdutoHttpService } from "../../services/produto-http.service" // Alterar esta linha

@Component({
  selector: "app-produto-crud",
  templateUrl: "./produto-crud.component.html",
  styleUrls: ["./produto-crud.component.scss"],
  standalone: false,
})
export class ProdutoCrudComponent implements OnInit {
  produtos: Produto[] = []
  produtoSelecionado: Produto | null = null

  // Estados dos dialogs
  showFormDialog = false
  showDetailDialog = false
  showDeleteDialog = false
  isNew = true

  @Output() produtosChanged = new EventEmitter<Produto[]>()

  constructor(
    private produtoHttpService: ProdutoHttpService, // Alterar esta linha
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.carregarProdutos()
  }

  carregarProdutos(): void {
    this.produtoHttpService.getProdutos().subscribe((produtos) => {
      this.produtos = produtos
      this.produtosChanged.emit(this.produtos)
    })
  }

  // Eventos do formulário
  onSalvarProduto(produto: Produto): void {
    if (this.isNew) {
      this.produtoHttpService.addProduto(produto).subscribe((novoProduto) => {
        this.messageService.add({
          severity: "success",
          summary: "Sucesso",
          detail: `Produto "${produto.nome}" criado com sucesso!`,
          life: 4000,
        })
        this.carregarProdutos()
      })
    } else {
      this.produtoHttpService.updateProduto(produto).subscribe(() => {
        this.messageService.add({
          severity: "success",
          summary: "Sucesso",
          detail: `Produto "${produto.nome}" atualizado com sucesso!`,
          life: 4000,
        })
        this.carregarProdutos()
      })
    }
  }

  // Eventos de exclusão
  onConfirmarExclusao(id: number): void {
    this.produtoHttpService.deleteProduto(id).subscribe(() => {
      this.carregarProdutos()

      if (this.produtoSelecionado) {
        this.messageService.add({
          severity: "success",
          summary: "Produto Excluído",
          detail: `"${this.produtoSelecionado.nome}" foi removido com sucesso!`,
          life: 4000,
        })
      }
    })
  }

  // Resto dos métodos permanecem iguais...
  onCriar(): void {
    this.produtoSelecionado = null
    this.isNew = true
    this.showFormDialog = true
  }

  onVisualizar(produto: Produto): void {
    this.produtoSelecionado = produto
    this.showDetailDialog = true
  }

  onEditar(produto: Produto): void {
    this.produtoSelecionado = produto
    this.isNew = false
    this.showFormDialog = true
  }

  onExcluir(id: number): void {
    this.produtoSelecionado = this.produtos.find((p) => p.id === id) || null
    this.showDeleteDialog = true
  }

  onEditarDoDetalhe(produto: Produto): void {
    this.showDetailDialog = false
    setTimeout(() => {
      this.onEditar(produto)
    }, 300)
  }
}
