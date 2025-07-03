import { Component, Input, Output, EventEmitter } from "@angular/core"
import { Produto } from "../../models/produto"

@Component({
  selector: "app-produto-list",
  templateUrl: "./produto-list.component.html",
  styleUrls: ["./produto-list.component.scss"],
  standalone: false,
})
export class ProdutoListComponent {
  @Input() produtos: Produto[] = []

  @Output() visualizar = new EventEmitter<Produto>()
  @Output() editar = new EventEmitter<Produto>()
  @Output() excluir = new EventEmitter<number>()
  @Output() criar = new EventEmitter<void>()

  onVisualizar(produto: Produto): void {
    this.visualizar.emit(produto)
  }

  onEditar(produto: Produto): void {
    this.editar.emit(produto)
  }

  onExcluir(id: number): void {
    this.excluir.emit(id)
  }

  onCriar(): void {
    this.criar.emit()
  }
}
