import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Produto } from "../models/produto";

@Injectable({
  providedIn: "root",
})
export class ProdutoHttpService {
  // CORREÇÃO: URL da API dinâmica para funcionar no Codespace e localmente
  private apiUrl = `${window.location.protocol}//${window.location.hostname.replace('4200', '8000')}/api/produtos`;

  constructor(private http: HttpClient) {}

  // Obter todos os produtos
  getProdutos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.apiUrl}/`);
  }

  // Obter produto por ID
  getProdutoById(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.apiUrl}/${id}/`);
  }

  // Adicionar novo produto
  addProduto(produto: Produto): Observable<Produto> {
    return this.http.post<Produto>(`${this.apiUrl}/`, produto);
  }

  // Atualizar produto existente
  updateProduto(produto: Produto): Observable<Produto> {
    return this.http.put<Produto>(`${this.apiUrl}/${produto.id}/`, produto);
  }

  // Excluir produto
  deleteProduto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }
}