import shutil
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError

from products.models import HeroSlide


HERO_SLIDES = (
    (1, 'Womens red color high heel for party for your first order get a free gift', 'women', 'hero_slide_1_red.png'),
    (2, 'Flat 50% Sale kids shoes', 'kids', 'hero_slide_2_kids.png'),
    (3, "Men's wear high heel office shoe only 40% discount today only", 'men', 'hero_slide_3_men.png'),
    (4, 'Womens High Heels Flat 30% offer for your first order', 'women', 'hero_slide_4_blue.png'),
)

IMAGE_EXTENSIONS = {'.bmp', '.gif', '.jpeg', '.jpg', '.png', '.svg', '.webp'}


class Command(BaseCommand):
    help = 'Import stepupimages into Django media and sync the rotating hero slides.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--source',
            type=Path,
            default=settings.BASE_DIR.parent / 'stepupimages',
            help='Folder containing the source images (defaults to the project stepupimages folder).',
        )

    def handle(self, *args, **options):
        source_dir = options['source'].resolve()
        if not source_dir.is_dir():
            raise CommandError(f'Image source directory does not exist: {source_dir}')

        settings.MEDIA_ROOT.mkdir(parents=True, exist_ok=True)
        imported_count = 0
        for source_file in source_dir.iterdir():
            if source_file.is_file() and source_file.suffix.lower() in IMAGE_EXTENSIONS:
                shutil.copy2(source_file, settings.MEDIA_ROOT / source_file.name)
                imported_count += 1

        hero_media_dir = settings.MEDIA_ROOT / 'hero_slides'
        hero_media_dir.mkdir(parents=True, exist_ok=True)
        frontend_images_dir = settings.BASE_DIR.parent / 'frontend' / 'public' / 'images'

        for order, title, category, filename in HERO_SLIDES:
            source_file = source_dir / filename
            if not source_file.is_file():
                source_file = frontend_images_dir / filename
            destination = hero_media_dir / filename
            if source_file.is_file():
                shutil.copy2(source_file, destination)
            elif not destination.is_file():
                raise CommandError(
                    f'Hero image {filename} was not found in {source_dir} or {frontend_images_dir}.'
                )

            HeroSlide.objects.update_or_create(
                order=order,
                defaults={
                    'title': title,
                    'category': category,
                    'image': f'hero_slides/{filename}',
                    'is_active': True,
                },
            )

        self.stdout.write(
            self.style.SUCCESS(
                f'Imported {imported_count} images into {settings.MEDIA_ROOT} and synced {len(HERO_SLIDES)} hero slides.'
            )
        )
