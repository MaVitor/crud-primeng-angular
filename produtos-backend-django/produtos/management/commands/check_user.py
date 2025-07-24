from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

class Command(BaseCommand):
    help = 'Verifica se o usuário demo existe e pode ser autenticado'

    def handle(self, *args, **options):
        username = 'admin'
        password = 'admin123'
        
        # Verificar se o usuário existe
        try:
            user = User.objects.get(username=username)
            self.stdout.write(
                self.style.SUCCESS(f"✓ Usuário '{username}' encontrado!")
            )
            self.stdout.write(f"  - ID: {user.id}")
            self.stdout.write(f"  - Email: {user.email}")
            self.stdout.write(f"  - Nome: {user.first_name} {user.last_name}")
            self.stdout.write(f"  - É ativo: {user.is_active}")
            self.stdout.write(f"  - É staff: {user.is_staff}")
            self.stdout.write(f"  - É superuser: {user.is_superuser}")
            
            # Testar autenticação
            auth_user = authenticate(username=username, password=password)
            if auth_user:
                self.stdout.write(
                    self.style.SUCCESS("✓ Autenticação funcionando!")
                )
            else:
                self.stdout.write(
                    self.style.ERROR("✗ Falha na autenticação!")
                )
                
        except User.DoesNotExist:
            self.stdout.write(
                self.style.ERROR(f"✗ Usuário '{username}' não encontrado!")
            )
            self.stdout.write("Execute: python manage.py create_demo_user")
