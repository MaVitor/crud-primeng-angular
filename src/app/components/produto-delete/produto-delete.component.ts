import { Component, Input, Output, EventEmitter } from "@angular/core"
import { Produto } from "../../models/produto"

@Component({
  selector: "app-produto-delete",
  templateUrl: "./produto-delete.component.html",
  styleUrls: ["./produto-delete.component.scss"],
  standalone: false,
})
export class ProdutoDeleteComponent {
  @Input() visible = false
  @Input() produto: Produto | null = null

  @Output() visibleChange = new EventEmitter<boolean>()
  @Output() confirmar = new EventEmitter<number>()
  @Output() cancelar = new EventEmitter<void>()

  onConfirmar(): void {
    if (this.produto?.id) {
      this.confirmar.emit(this.produto.id)
      this.fecharDialog()
    }
  }

  onCancelar(): void {
    this.cancelar.emit()
    this.fecharDialog()
  }

  private fecharDialog(): void {
    this.visible = false
    this.visibleChange.emit(false)
  }
}
