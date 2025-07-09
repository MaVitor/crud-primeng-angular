import { Injectable } from "@angular/core"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { Observable, of } from "rxjs"
import { catchError, tap } from "rxjs/operators"
import { Produto } from "../models/produto"

@Injectable({
  providedIn: "root",
})
export class ProdutoHttpService {
  private apiUrl = "http://127.0.0.1:8000/api/produtos" // URL do Django

  private httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      Accept: "application/json",
    }),
  }

  constructor(private http: HttpClient) {}

  /** GET produtos do servidor Django */
  getProdutos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.apiUrl}/`).pipe(
      tap((produtos) => console.log(`${produtos.length} produtos carregados do Django`)),
      catchError(this.handleError<Produto[]>("getProdutos", [])),
    )
  }

  /** GET produto por id */
  getProduto(id: number): Observable<Produto> {
    const url = `${this.apiUrl}/${id}/`
    return this.http.get<Produto>(url).pipe(
      tap((produto) => console.log(`Produto ${produto.nome} carregado do Django`)),
      catchError(this.handleError<Produto>(`getProduto id=${id}`)),
    )
  }

  /** POST: adicionar novo produto */
  addProduto(produto: Produto): Observable<Produto> {
    return this.http.post<Produto>(`${this.apiUrl}/`, produto, this.httpOptions).pipe(
      tap((novoProduto: Produto) => console.log(`Produto ${novoProduto.nome} criado no Django`)),
      catchError(this.handleError<Produto>("addProduto")),
    )
  }

  /** PUT: atualizar produto */
  updateProduto(produto: Produto): Observable<Produto> {
    const url = `${this.apiUrl}/${produto.id}/`
    return this.http.put<Produto>(url, produto, this.httpOptions).pipe(
      tap((produtoAtualizado) => console.log(`Produto ${produtoAtualizado.nome} atualizado no Django`)),
      catchError(this.handleError<Produto>("updateProduto")),
    )
  }

  /** DELETE: deletar produto */
  deleteProduto(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}/`
    return this.http.delete(url, this.httpOptions).pipe(
      tap(() => console.log(`Produto id=${id} deletado do Django`)),
      catchError(this.handleError<any>("deleteProduto")),
    )
  }

  /** GET: produtos disponíveis */
  getProdutosDisponiveis(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.apiUrl}/disponiveis/`).pipe(
      tap((produtos) => console.log(`${produtos.length} produtos disponíveis carregados`)),
      catchError(this.handleError<Produto[]>("getProdutosDisponiveis", [])),
    )
  }

  /**
   * Manipula operações Http que falharam.
   */
  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} falhou:`, error)

      // Log mais detalhado para debug
      if (error.error) {
        console.error("Detalhes do erro:", error.error)
      }

      return of(result as T)
    }
  }
}
