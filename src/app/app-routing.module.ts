import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { ProdutoListPageComponent } from "./pages/produto-list-page/produto-list-page.component"
import { ProdutoCreatePageComponent } from "./pages/produto-create-page/produto-create-page.component"
import { ProdutoEditPageComponent } from "./pages/produto-edit-page/produto-edit-page.component"
import { ProdutoDetailPageComponent } from "./pages/produto-detail-page/produto-detail-page.component"
import { LoginPageComponent } from "./pages/login-page/login-page.component"
import { AuthGuard } from "./guards/auth.guard"
import { GuestGuard } from "./guards/guest.guard"

// Definição das rotas da aplicação
const routes: Routes = [
  { path: "", redirectTo: "/produtos", pathMatch: "full" }, // Rota padrão redireciona para listagem
  {
    path: "login",
    component: LoginPageComponent,
    canActivate: [GuestGuard], // Apenas usuários não autenticados podem acessar
  },
  {
    path: "produtos",
    component: ProdutoListPageComponent,
    canActivate: [AuthGuard], // Protegida por autenticação
  },
  {
    path: "produtos/novo",
    component: ProdutoCreatePageComponent,
    canActivate: [AuthGuard], // Protegida por autenticação
  },
  {
    path: "produtos/:id/editar",
    component: ProdutoEditPageComponent,
    canActivate: [AuthGuard], // Protegida por autenticação
  },
  {
    path: "produtos/:id/detalhes",
    component: ProdutoDetailPageComponent,
    canActivate: [AuthGuard], // Protegida por autenticação
  },
  { path: "**", redirectTo: "/login" }, // Rota wildcard redireciona para login
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
