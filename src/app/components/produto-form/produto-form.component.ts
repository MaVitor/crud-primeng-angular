import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from "@angular/core"
import { MessageService } from "primeng/api"
import { Produto } from "../../models/produto"

@Component({
  selector: "app-produto-form",
  templateUrl: "./produto-form.component.html",
  styleUrls: ["./produto-form.component.scss"],
  standalone: false,
})
export class ProdutoFormComponent implements OnChanges {
  @Input() visible = false
  @Input() produto: Produto | null = null
  @Input() isNew = true

  @Output() visibleChange = new EventEmitter<boolean>()
  @Output() salvar = new EventEmitter<Produto>()
  @Output() cancelar = new EventEmitter<void>()

  produtoForm: Produto = this.criarProdutoVazio()

  constructor(private messageService: MessageService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["produto"] && this.produto) {
      this.produtoForm = { ...this.produto }
    } else if (changes["isNew"] && this.isNew) {
      this.produtoForm = this.criarProdutoVazio()
    }
  }

  criarProdutoVazio(): Produto {
    return { nome: "", preco: 0, disponivel: true }
  }

  onSalvar(): void {
    if (!this.validarFormulario()) {
      return
    }

    this.salvar.emit({ ...this.produtoForm })
    this.fecharDialog()
  }

  onCancelar(): void {
    this.cancelar.emit()
    this.fecharDialog()
  }

  private validarFormulario(): boolean {
    if (!this.produtoForm.nome.trim()) {
      this.messageService.add({
        severity: "warn",
        summary: "Atenção",
        detail: "Nome do produto é obrigatório!",
      })
      return false
    }

    if (this.produtoForm.preco <= 0) {
      this.messageService.add({
        severity: "warn",
        summary: "Atenção",
        detail: "Preço deve ser maior que zero!",
      })
      return false
    }

    return true
  }

  private fecharDialog(): void {
    this.visible = false
    this.visibleChange.emit(false)
  }
}
