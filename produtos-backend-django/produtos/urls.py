from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProdutoViewSet

# Criar router para as rotas da API
router = DefaultRouter()
router.register(r'produtos', ProdutoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
