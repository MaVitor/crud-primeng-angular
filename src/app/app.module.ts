import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

// Módulos do PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CardModule } from 'primeng/card';         // <-- NOVO
import { TagModule } from 'primeng/tag';           // <-- NOVO
import { TooltipModule } from 'primeng/tooltip';   // <-- NOVO
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';

// Serviços do PrimeNG
import { MessageService, ConfirmationService } from 'primeng/api';

import { AppComponent } from './app.component';
import { ProdutoCrudComponent } from './components/produto-crud/produto-crud.component';

@NgModule({
  declarations: [
    AppComponent,
    ProdutoCrudComponent
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
    MessageModule,      // 👈 Adicione isso
    MessagesModule
  ],
  providers: [
    MessageService,
    ConfirmationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }