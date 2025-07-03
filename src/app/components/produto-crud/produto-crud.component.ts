import { Component, OnInit, Output, EventEmitter } from "@angular/core"
import { MessageService } from "primeng/api"
import { Produto } from "../../models/produto"
import { ProdutoService } from "../../services/produto.service"

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
    private produtoService: ProdutoService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.carregarProdutos()
  }

  carregarProdutos(): void {
    this.produtos = this.produtoService.getProdutos()
    this.produtosChanged.emit(this.produtos)
  }

  // Eventos da lista
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

  // Eventos do formulário
  onSalvarProduto(produto: Produto): void {
    if (this.isNew) {
      this.produtoService.addProduto(produto)
      this.messageService.add({
        severity: "success",
        summary: "Sucesso",
        detail: `Produto "${produto.nome}" criado com sucesso!`,
        life: 4000,
      })
    } else {
      this.produtoService.updateProduto(produto)
      this.messageService.add({
        severity: "success",
        summary: "Sucesso",
        detail: `Produto "${produto.nome}" atualizado com sucesso!`,
        life: 4000,
      })
    }
    this.carregarProdutos()
  }

  // Eventos de exclusão
  onConfirmarExclusao(id: number): void {
    this.produtoService.deleteProduto(id)
    this.carregarProdutos()

    if (this.produtoSelecionado) {
      this.messageService.add({
        severity: "success",
        summary: "Produto Excluído",
        detail: `"${this.produtoSelecionado.nome}" foi removido com sucesso!`,
        life: 4000,
      })
    }
  }

  // Evento de edição a partir dos detalhes
  onEditarDoDetalhe(produto: Produto): void {
    this.showDetailDialog = false
    setTimeout(() => {
      this.onEditar(produto)
    }, 300)
  }
}
