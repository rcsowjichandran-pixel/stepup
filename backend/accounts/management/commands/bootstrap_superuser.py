import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = 'Create the initial admin user from environment variables if it does not exist.'

    def handle(self, *args, **options):
        username = os.environ.get('DJANGO_SUPERUSER_USERNAME', '').strip()
        password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', '')
        email = os.environ.get('DJANGO_SUPERUSER_EMAIL', '').strip()

        if not username or not password:
            self.stdout.write('Admin bootstrap skipped; username or password is not configured.')
            return

        user_model = get_user_model()
        existing_user = user_model.objects.filter(**{user_model.USERNAME_FIELD: username}).first()
        if existing_user:
            if existing_user.is_staff and existing_user.is_superuser:
                self.stdout.write(f'Admin user "{username}" already exists; no changes made.')
                return
            raise CommandError(
                f'User "{username}" already exists but is not a superuser. '
                'Choose another bootstrap username or promote the account through Django.'
            )

        user_model.objects.create_superuser(username=username, email=email, password=password)
        self.stdout.write(self.style.SUCCESS(f'Created initial admin user "{username}".'))
