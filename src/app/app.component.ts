import { Component } from "@angular/core"

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "gerenciador-produtos-angular"
  totalProdutos = 0
  produtosDisponiveis = 0

  onProdutosChanged(produtos: any[]): void {
    this.totalProdutos = produtos.length
    this.produtosDisponiveis = produtos.filter((p) => p.disponivel).length
  }
}
