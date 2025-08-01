import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from "@angular/common/http"

// Módulo de rotas
import { AppRoutingModule } from "./app-routing.module"

// Interceptor de autenticação
import { AuthInterceptor } from "./interceptors/auth.interceptor"

// Módulos do PrimeNG
import { TableModule } from "primeng/table"
import { ButtonModule } from "primeng/button"
import { DialogModule } from "primeng/dialog"
import { InputTextModule } from "primeng/inputtext"
import { InputNumberModule } from "primeng/inputnumber"
import { InputSwitchModule } from "primeng/inputswitch"
import { ToastModule } from "primeng/toast"
import { ConfirmDialogModule } from "primeng/confirmdialog"
import { CardModule } from "primeng/card"
import { TagModule } from "primeng/tag"
import { TooltipModule } from "primeng/tooltip"
import { MessagesModule } from "primeng/messages"
import { MessageModule } from "primeng/message"
import { MenubarModule } from "primeng/menubar"
import { ToolbarModule } from "primeng/toolbar"
import { MenuModule } from "primeng/menu"
import { PasswordModule } from "primeng/password"

// Serviços do PrimeNG
import { MessageService, ConfirmationService } from "primeng/api"

// Componentes Clássicos (Não-Standalone)
import { AppComponent } from "./app.component"
import { ProdutoCrudComponent } from "./components/produto-crud/produto-crud.component"
import { ProdutoListComponent } from "./components/produto-list/produto-list.component"
import { ProdutoFormComponent } from "./components/produto-form/produto-form.component"
import { ProdutoDetailComponent } from "./components/produto-detail/produto-detail.component"
import { ProdutoDeleteComponent } from "./components/produto-delete/produto-delete.component"

// Componentes Standalone (Páginas) - REMOVIDO HeaderComponent
import { ProdutoListPageComponent } from "./pages/produto-list-page/produto-list-page.component"
import { ProdutoCreatePageComponent } from "./pages/produto-create-page/produto-create-page.component"
import { ProdutoEditPageComponent } from "./pages/produto-edit-page/produto-edit-page.component"
import { ProdutoDetailPageComponent } from "./pages/produto-detail-page/produto-detail-page.component"
import { LoginPageComponent } from "./pages/login-page/login-page.component"

@NgModule({
  declarations: [
    // Apenas componentes que NÃO são standalone ficam aqui
    AppComponent,
    ProdutoCrudComponent,
    ProdutoListComponent,
    ProdutoFormComponent,
    ProdutoDetailComponent,
    ProdutoDeleteComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule, // Adicionado para formulários reativos
    AppRoutingModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    InputSwitchModule,
    ToastModule,
    ConfirmDialogModule,
    CardModule,
    TagModule,
    TooltipModule,
    MessageModule,
    MessagesModule,
    MenubarModule,
    ToolbarModule,
    MenuModule,
    PasswordModule,

    // Componentes Standalone - REMOVIDO HeaderComponent
    ProdutoListPageComponent,
    ProdutoCreatePageComponent,
    ProdutoEditPageComponent,
    ProdutoDetailPageComponent,
    LoginPageComponent,
  ],
  providers: [
    MessageService,
    ConfirmationService,
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}