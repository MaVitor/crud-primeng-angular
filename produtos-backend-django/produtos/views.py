from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from .models import Produto
from .serializers import ProdutoSerializer
import logging

logger = logging.getLogger(__name__)

class ProdutoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para operações CRUD de Produtos
    """
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer

    def list(self, request):
        """
        GET /api/produtos/ - Listar todos os produtos
        """
        try:
            produtos = self.get_queryset()
            serializer = self.get_serializer(produtos, many=True)
            logger.info(f"Listando {len(serializer.data)} produtos")
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Erro ao listar produtos: {str(e)}")
            return Response(
                {"error": "Erro interno do servidor"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def create(self, request):
        """
        POST /api/produtos/ - Criar novo produto
        """
        try:
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                produto = serializer.save()
                logger.info(f"Produto criado: {produto.nome}")
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                logger.warning(f"Dados inválidos para criação: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Erro ao criar produto: {str(e)}")
            return Response(
                {"error": "Erro interno do servidor"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def retrieve(self, request, pk=None):
        """
        GET /api/produtos/{id}/ - Buscar produto por ID
        """
        try:
            produto = get_object_or_404(Produto, pk=pk)
            serializer = self.get_serializer(produto)
            logger.info(f"Produto recuperado: {produto.nome}")
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Erro ao recuperar produto {pk}: {str(e)}")
            return Response(
                {"error": "Produto não encontrado"}, 
                status=status.HTTP_404_NOT_FOUND
            )

    def update(self, request, pk=None):
        """
        PUT /api/produtos/{id}/ - Atualizar produto
        """
        try:
            produto = get_object_or_404(Produto, pk=pk)
            serializer = self.get_serializer(produto, data=request.data)
            if serializer.is_valid():
                produto_atualizado = serializer.save()
                logger.info(f"Produto atualizado: {produto_atualizado.nome}")
                return Response(serializer.data)
            else:
                logger.warning(f"Dados inválidos para atualização: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Erro ao atualizar produto {pk}: {str(e)}")
            return Response(
                {"error": "Erro interno do servidor"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def destroy(self, request, pk=None):
        """
        DELETE /api/produtos/{id}/ - Deletar produto
        """
        try:
            produto = get_object_or_404(Produto, pk=pk)
            nome_produto = produto.nome
            produto.delete()
            logger.info(f"Produto deletado: {nome_produto}")
            return Response(
                {"message": f"Produto '{nome_produto}' deletado com sucesso"}, 
                status=status.HTTP_204_NO_CONTENT
            )
        except Exception as e:
            logger.error(f"Erro ao deletar produto {pk}: {str(e)}")
            return Response(
                {"error": "Erro interno do servidor"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'])
    def disponiveis(self, request):
        """
        GET /api/produtos/disponiveis/ - Listar apenas produtos disponíveis
        """
        try:
            produtos_disponiveis = self.get_queryset().filter(disponivel=True)
            serializer = self.get_serializer(produtos_disponiveis, many=True)
            logger.info(f"Listando {len(serializer.data)} produtos disponíveis")
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Erro ao listar produtos disponíveis: {str(e)}")
            return Response(
                {"error": "Erro interno do servidor"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
