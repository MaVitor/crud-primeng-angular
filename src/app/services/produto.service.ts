import { Injectable } from '@angular/core';
import { Produto } from '../models/produto';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private produtos: Produto[] = [
    { id: 1, nome: 'Teclado Mecânico RGB', preco: 450.00, disponivel: true },
    { id: 2, nome: 'Mouse Gamer sem Fio', preco: 250.75, disponivel: true },
    { id: 3, nome: 'Headset 7.1 Surround', preco: 599.90, disponivel: false }
  ];
  private nextId: number = 4;

  constructor() { }

  getProdutos(): Produto[] {
    return this.produtos;
  }

  addProduto(produto: Produto): void {
    const novoProduto = { ...produto, id: this.nextId++ };
    this.produtos.push(novoProduto);
  }

  updateProduto(produtoAtualizado: Produto): void {
    const index = this.produtos.findIndex(p => p.id === produtoAtualizado.id);
    if (index !== -1) {
      this.produtos[index] = produtoAtualizado;
    }
  }

  deleteProduto(id: number): void {
    this.produtos = this.produtos.filter(p => p.id !== id);
  }
}