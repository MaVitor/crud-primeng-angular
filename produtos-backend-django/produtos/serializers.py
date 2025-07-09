from rest_framework import serializers
from .models import Produto

class ProdutoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produto
        fields = ['id', 'nome', 'preco', 'disponivel', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def validate_nome(self, value):
        """
        Validar se o nome não está vazio
        """
        if not value.strip():
            raise serializers.ValidationError("Nome do produto não pode estar vazio.")
        return value.strip()

    def validate_preco(self, value):
        """
        Validar se o preço é positivo
        """
        if value <= 0:
            raise serializers.ValidationError("Preço deve ser maior que zero.")
        return value
