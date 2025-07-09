from django.contrib import admin
from .models import Produto

@admin.register(Produto)
class ProdutoAdmin(admin.ModelAdmin):
    list_display = ['nome', 'preco', 'disponivel', 'created_at', 'updated_at']
    list_filter = ['disponivel', 'created_at']
    search_fields = ['nome']
    list_editable = ['disponivel']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']
