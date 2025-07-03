import { Component, Input, Output, EventEmitter } from "@angular/core"
import { Produto } from "../../models/produto"

@Component({
  selector: "app-produto-detail",
  templateUrl: "./produto-detail.component.html",
  styleUrls: ["./produto-detail.component.scss"],
  standalone: false,
})
export class ProdutoDetailComponent {
  @Input() visible = false
  @Input() produto: Produto | null = null

  @Output() visibleChange = new EventEmitter<boolean>()
  @Output() editar = new EventEmitter<Produto>()
  @Output() fechar = new EventEmitter<void>()

  dataAtual = new Date()

  onEditar(): void {
    if (this.produto) {
      this.editar.emit(this.produto)
      this.fecharDialog()
    }
  }

  onFechar(): void {
    this.fechar.emit()
    this.fecharDialog()
  }

  private fecharDialog(): void {
    this.visible = false
    this.visibleChange.emit(false)
  }
}
