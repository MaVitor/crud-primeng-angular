from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Cria um usuário de demonstração para testes'

    def handle(self, *args, **options):
        username = 'admin'
        password = 'admin123'
        email = 'admin@exemplo.com'
        
        # Verificar se o usuário já existe
        if User.objects.filter(username=username).exists():
            self.stdout.write(
                self.style.WARNING(f"Usuário '{username}' já existe!")
            )
            user = User.objects.get(username=username)
            self.stdout.write(f"Username: {username}")
            self.stdout.write(f"Email: {user.email}")
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
        
        self.stdout.write(
            self.style.SUCCESS('Usuário criado com sucesso!')
        )
        self.stdout.write(f"Username: {username}")
        self.stdout.write(f"Password: {password}")
        self.stdout.write(f"Email: {email}")
        self.stdout.write(
            self.style.SUCCESS('Agora você pode fazer login na aplicação Angular!')
        )
