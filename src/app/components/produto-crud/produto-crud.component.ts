import { Component, OnInit, Output, EventEmitter } from "@angular/core"
import { ConfirmationService, MessageService } from "primeng/api"
import { Produto } from "../../models/produto"
import { ProdutoService } from "../../services/produto.service"

@Component({
  selector: "app-produto-crud",
  templateUrl: "./produto-crud.component.html",
  styleUrls: ["./produto-crud.component.scss"],
})
export class ProdutoCrudComponent implements OnInit {
  produtos: Produto[] = []
  produto: Produto = this.criarProdutoVazio()
  produtoSelecionado: Produto | null = null
  displayDialog = false
  displayViewDialog = false
  isNew = true

  displayDeleteDialog = false
  produtoParaExcluir: Produto | null = null

  // Propriedade para a data atual
  dataAtual = new Date()

  @Output() produtosChanged = new EventEmitter<Produto[]>()

  constructor(
    private produtoService: ProdutoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void {
    this.carregarProdutos()
  }

  carregarProdutos(): void {
    this.produtos = this.produtoService.getProdutos()
    this.produtosChanged.emit(this.produtos)
  }

  criarProdutoVazio(): Produto {
    return { nome: "", preco: 0, disponivel: true }
  }

  abrirDialogoParaCriar(): void {
    this.produto = this.criarProdutoVazio()
    this.isNew = true
    this.displayDialog = true
  }

  abrirDialogoParaEditar(produto: Produto): void {
    this.produto = { ...produto }
    this.isNew = false
    this.displayDialog = true
  }

  visualizarProduto(produto: Produto): void {
    this.produtoSelecionado = { ...produto }
    this.displayViewDialog = true
  }

  editarDaVisualizacao(): void {
    if (this.produtoSelecionado) {
      this.displayViewDialog = false

      // Aguarda o fechamento do modal antes de abrir o outro
      setTimeout(() => {
        this.abrirDialogoParaEditar(this.produtoSelecionado!)
      }, 300)
    }
  }

  salvarProduto(): void {
    if (!this.produto.nome.trim()) {
      this.messageService.add({
        severity: "warn",
        summary: "Atenção",
        detail: "Nome do produto é obrigatório!",
      })
      return
    }

    if (this.produto.preco <= 0) {
      this.messageService.add({
        severity: "warn",
        summary: "Atenção",
        detail: "Preço deve ser maior que zero!",
      })
      return
    }

    if (this.isNew) {
      this.produtoService.addProduto(this.produto)
      this.messageService.add({
        severity: "success",
        summary: "Sucesso",
        detail: `Produto "${this.produto.nome}" criado com sucesso!`,
        life: 4000,
      })
    } else {
      this.produtoService.updateProduto(this.produto)
      this.messageService.add({
        severity: "success",
        summary: "Sucesso",
        detail: `Produto "${this.produto.nome}" atualizado com sucesso!`,
        life: 4000,
      })
    }

    this.displayDialog = false
    this.carregarProdutos()
  }

  confirmarExclusao(id: number): void {
    const produto = this.produtos.find((p) => p.id === id)
    this.produtoParaExcluir = produto || null
    this.displayDeleteDialog = true
  }

  confirmarExclusaoFinal(): void {
    if (this.produtoParaExcluir?.id) {
      this.produtoService.deleteProduto(this.produtoParaExcluir.id)
      this.carregarProdutos()
      this.messageService.add({
        severity: "success",
        summary: "Produto Excluído",
        detail: `"${this.produtoParaExcluir.nome}" foi removido com sucesso!`,
        life: 4000,
      })
    }
    this.displayDeleteDialog = false
    this.produtoParaExcluir = null
  }
}
