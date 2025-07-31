import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
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
    ReactiveFormsModule, // Importe o ReactiveFormsModule aqui também
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
  produtoForm!: FormGroup;
  produtoId = 0;
  carregando = false;
  salvando = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private produtoHttpService: ProdutoHttpService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.produtoForm = this.fb.group({
      id: [null],
      nome: ["", [Validators.required, Validators.minLength(3)]],
      preco: [0, [Validators.required, Validators.min(0.01)]],
      disponivel: [true],
    });

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
        this.produtoForm.patchValue(produto); // Popula o formulário com os dados do produto
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

  onSalvar(): void {
    if (this.produtoForm.invalid) {
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

    this.produtoHttpService.updateProduto(produto).subscribe({
      next: (produtoAtualizado) => {
        this.messageService.add({
          severity: "success",
          summary: "Sucesso",
          detail: `Produto "${produto.nome}" atualizado com sucesso!`,
        });
        this.router.navigate(["/produtos"]);
      },
      error: (error) => {
        this.messageService.add({
          severity: "error",
          summary: "Erro",
          detail: "Erro ao atualizar produto. Tente novamente.",
        });
        this.salvando = false;
      },
    });
  }

  onCancelar(): void {
    this.router.navigate(["/produtos"]);
  }

  get nome() {
    return this.produtoForm.get('nome');
  }

  get preco() {
    return this.produtoForm.get('preco');
  }
}