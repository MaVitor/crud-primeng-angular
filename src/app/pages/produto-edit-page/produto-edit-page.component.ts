import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { Produto } from "../../models/produto";
import { ProdutoHttpService } from "../../services/produto-http.service";

// Módulos do PrimeNG
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { InputTextModule } from "primeng/inputtext";
import { InputNumberModule } from "primeng/inputnumber";
import { InputSwitchModule } from "primeng/inputswitch";
import { ToastModule } from "primeng/toast";

@Component({
  selector: "app-produto-edit-page",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    InputNumberModule,
    InputSwitchModule,
    ToastModule,
  ],
  templateUrl: "./produto-edit-page.component.html",
  styleUrls: ["./produto-edit-page.component.scss"],
})
export class ProdutoEditPageComponent implements OnInit {
  produto: Produto = {
    nome: "",
    preco: 0,
    disponivel: true,
  };

  produtoId = 0;
  carregando = false;
  salvando = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private produtoHttpService: ProdutoHttpService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    // Obter ID do produto da rota
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

  // Carregar dados do produto
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

  // Salvar alterações
  onSalvar(): void {
    if (!this.validarFormulario()) {
      return;
    }

    this.salvando = true;
    this.produtoHttpService.updateProduto(this.produto).subscribe({
      next: (produtoAtualizado) => {
        this.messageService.add({
          severity: "success",
          summary: "Sucesso",
          detail: `Produto "${this.produto.nome}" atualizado com sucesso!`,
        });
        this.router.navigate(["/produtos"]);
      },
      error: (error) => {
        this.messageService.add({
          severity: "error",
          summary: "Erro",
          detail: "Erro ao atualizar produto",
        });
        this.salvando = false;
      },
    });
  }

  // Cancelar e voltar
  onCancelar(): void {
    this.router.navigate(["/produtos"]);
  }

  // Validar formulário
  private validarFormulario(): boolean {
    if (!this.produto.nome.trim()) {
      this.messageService.add({
        severity: "warn",
        summary: "Atenção",
        detail: "Nome do produto é obrigatório!",
      });
      return false;
    }

    if (this.produto.preco <= 0) {
      this.messageService.add({
        severity: "warn",
        summary: "Atenção",
        detail: "Preço deve ser maior que zero!",
      });
      return false;
    }

    return true;
  }
}