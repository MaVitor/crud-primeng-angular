import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
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
  selector: "app-produto-create-page",
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
  templateUrl: "./produto-create-page.component.html",
  styleUrls: ["./produto-create-page.component.scss"],
})
export class ProdutoCreatePageComponent {
  produto: Produto = {
    nome: "",
    preco: 0,
    disponivel: true,
  };

  salvando = false;

  constructor(
    private produtoHttpService: ProdutoHttpService,
    private messageService: MessageService,
    private router: Router
  ) {}

  // Salvar novo produto
  onSalvar(): void {
    if (!this.validarFormulario()) {
      return;
    }

    this.salvando = true;
    this.produtoHttpService.addProduto(this.produto).subscribe({
      next: (novoProduto) => {
        this.messageService.add({
          severity: "success",
          summary: "Sucesso",
          detail: `Produto "${this.produto.nome}" criado com sucesso!`,
        });
        this.router.navigate(["/produtos"]);
      },
      error: (error) => {
        this.messageService.add({
          severity: "error",
          summary: "Erro",
          detail: "Erro ao criar produto",
        });
        this.salvando = false;
      },
    });
  }

  // Cancelar e voltar para listagem
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