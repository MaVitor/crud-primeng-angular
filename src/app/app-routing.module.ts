import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { ProdutoListPageComponent } from "./pages/produto-list-page/produto-list-page.component"
import { ProdutoCreatePageComponent } from "./pages/produto-create-page/produto-create-page.component"
import { ProdutoEditPageComponent } from "./pages/produto-edit-page/produto-edit-page.component"
import { ProdutoDetailPageComponent } from "./pages/produto-detail-page/produto-detail-page.component"

// Definição das rotas da aplicação
const routes: Routes = [
  { path: "", redirectTo: "/produtos", pathMatch: "full" }, // Rota padrão redireciona para listagem
  { path: "produtos", component: ProdutoListPageComponent }, // Listagem de produtos
  { path: "produtos/novo", component: ProdutoCreatePageComponent }, // Criar novo produto
  { path: "produtos/:id/editar", component: ProdutoEditPageComponent }, // Editar produto existente
  { path: "produtos/:id/detalhes", component: ProdutoDetailPageComponent }, // Visualizar detalhes do produto
  { path: "**", redirectTo: "/produtos" }, // Rota wildcard para páginas não encontradas
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
