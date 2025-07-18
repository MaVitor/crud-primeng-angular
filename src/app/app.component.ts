import { Component } from "@angular/core"

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  standalone: false,
})
export class AppComponent {
  title = "Sistema de Gerenciamento de Produtos"
  totalProdutos = 0
  produtosDisponiveis = 0

  onProdutosChanged(produtos: any[]): void {
    this.totalProdutos = produtos.length
    this.produtosDisponiveis = produtos.filter((p) => p.disponivel).length
  }
}
