import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { FormsModule } from "@angular/forms"
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http"

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

// Serviços do PrimeNG
import { MessageService, ConfirmationService } from "primeng/api"

import { AppComponent } from "./app.component"
import { ProdutoCrudComponent } from "./components/produto-crud/produto-crud.component"
import { ProdutoListComponent } from "./components/produto-list/produto-list.component"
import { ProdutoFormComponent } from "./components/produto-form/produto-form.component"
import { ProdutoDetailComponent } from "./components/produto-detail/produto-detail.component"
import { ProdutoDeleteComponent } from "./components/produto-delete/produto-delete.component"

@NgModule({
  declarations: [
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
  ],
  providers: [MessageService, ConfirmationService, provideHttpClient(withInterceptorsFromDi())],
  bootstrap: [AppComponent],
})
export class AppModule {}
