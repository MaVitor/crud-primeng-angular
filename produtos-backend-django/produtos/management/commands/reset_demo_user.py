from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Remove e recria o usuário de demonstração'

    def handle(self, *args, **options):
        username = 'admin'
        password = 'admin123'
        email = 'admin@exemplo.com'
        
        # Remover usuário existente se houver
        if User.objects.filter(username=username).exists():
            User.objects.filter(username=username).delete()
            self.stdout.write(
                self.style.WARNING(f"Usuário '{username}' removido!")
            )
        
        # Criar novo usuário
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
        user.is_active = True  # Garantir que está ativo
        user.save()
        
        self.stdout.write(
            self.style.SUCCESS('✓ Usuário recriado com sucesso!')
        )
        self.stdout.write(f"Username: {username}")
        self.stdout.write(f"Password: {password}")
        self.stdout.write(f"Email: {email}")
        
        # Testar autenticação
        from django.contrib.auth import authenticate
        auth_user = authenticate(username=username, password=password)
        if auth_user:
            self.stdout.write(
                self.style.SUCCESS("✓ Teste de autenticação passou!")
            )
        else:
            self.stdout.write(
                self.style.ERROR("✗ Teste de autenticação falhou!")
            )
