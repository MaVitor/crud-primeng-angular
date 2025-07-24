"""
Script para criar um usuário de demonstração
Execute este script a partir do diretório produtos-backend-django:
python manage.py shell < ../scripts/create_demo_user.py
"""

from django.contrib.auth.models import User

def create_demo_user():
    """
    Criar usuário de demonstração
    """
    username = 'admin'
    password = 'admin123'
    email = 'admin@exemplo.com'
    
    # Verificar se o usuário já existe
    if User.objects.filter(username=username).exists():
        print(f"Usuário '{username}' já existe!")
        user = User.objects.get(username=username)
        print(f"Username: {username}")
        print(f"Email: {user.email}")
        return
    
    # Criar usuário
    user = User.objects.create_user(
        username=username,
        password=password,
        email=email,
        first_name='Administrador',
        last_name='Sistema'
    )
    
    # Tornar superusuário
    user.is_staff = True
    user.is_superuser = True
    user.save()
    
    print(f"Usuário criado com sucesso!")
    print(f"Username: {username}")
    print(f"Password: {password}")
    print(f"Email: {email}")

# Executar a função
create_demo_user()
