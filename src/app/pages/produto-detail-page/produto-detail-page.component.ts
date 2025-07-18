import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { Produto } from "../../models/produto";
import { ProdutoHttpService } from "../../services/produto-http.service";

// Módulos de UI para o template
import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";
import { ToastModule } from "primeng/toast";
import { TagModule } from "primeng/tag";

@Component({
  selector: "app-produto-detail-page",
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, ToastModule, TagModule],
  templateUrl: "./produto-detail-page.component.html",
  styleUrls: ["./produto-detail-page.component.scss"],
})
export class ProdutoDetailPageComponent implements OnInit {
  produto: Produto | null = null;
  produtoId = 0;
  carregando = false;
  dataAtual = new Date(); // Corrigindo o erro do 'new Date()' no template

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private produtoHttpService: ProdutoHttpService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.produtoId = Number(this.route.snapshot.paramMap.get("id"));
    if (this.produtoId) {
      this.carregarProduto();
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Erro",
        detail: "ID do produto não encontrado",
      });
      this.router.navigate(["/produtos"]);
    }
  }

  carregarProduto(): void {
    this.carregando = true;
    this.produtoHttpService.getProdutoById(this.produtoId).subscribe({
      next: (produto) => {
        this.produto = produto;
        this.carregando = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: "error",
          summary: "Erro",
          detail: "Produto não encontrado",
        });
        this.router.navigate(["/produtos"]);
      },
    });
  }

  onEditar(): void {
    if (this.produto?.id) {
      this.router.navigate(["/produtos", this.produto.id, "editar"]);
    }
  }

  onVoltar(): void {
    this.router.navigate(["/produtos"]);
  }
}