import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
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
    ReactiveFormsModule, // Importe o ReactiveFormsModule aqui também
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
export class ProdutoCreatePageComponent implements OnInit {
  produtoForm!: FormGroup;
  salvando = false;

  constructor(
    private fb: FormBuilder,
    private produtoHttpService: ProdutoHttpService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.produtoForm = this.fb.group({
      nome: ["", [Validators.required, Validators.minLength(3)]],
      preco: [0, [Validators.required, Validators.min(0.01)]],
      disponivel: [true],
    });
  }

  // Salvar novo produto
  onSalvar(): void {
    if (this.produtoForm.invalid) {
      // Marcar todos os campos como "tocados" para exibir mensagens de erro
      Object.values(this.produtoForm.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });

      this.messageService.add({
        severity: "warn",
        summary: "Atenção",
        detail: "Preencha os campos obrigatórios!",
      });
      return;
    }

    this.salvando = true;
    const produto: Produto = this.produtoForm.value;

    this.produtoHttpService.addProduto(produto).subscribe({
      next: (novoProduto) => {
        this.messageService.add({
          severity: "success",
          summary: "Sucesso",
          detail: `Produto "${produto.nome}" criado com sucesso!`,
        });
        this.router.navigate(["/produtos"]);
      },
      error: (error) => {
        this.messageService.add({
          severity: "error",
          summary: "Erro",
          detail: "Erro ao criar produto. Tente novamente.",
        });
        this.salvando = false;
      },
    });
  }

  // Cancelar e voltar para listagem
  onCancelar(): void {
    this.router.navigate(["/produtos"]);
  }

  // Acessadores para facilitar o uso no template
  get nome() {
    return this.produtoForm.get('nome');
  }

  get preco() {
    return this.produtoForm.get('preco');
  }
}