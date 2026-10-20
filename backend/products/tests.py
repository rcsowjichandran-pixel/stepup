from django.test import TestCase
from rest_framework.test import APIClient

from .models import HeroSlide


class HeroSlidesApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_returns_active_slides_in_order_with_media_urls(self):
        HeroSlide.objects.create(
            title='Second slide',
            category='kids',
            image='hero_slides/second.png',
            order=2,
        )
        HeroSlide.objects.create(
            title='Inactive slide',
            category='men',
            image='hero_slides/inactive.png',
            order=3,
            is_active=False,
        )
        HeroSlide.objects.create(
            title='First slide',
            category='women',
            image='hero_slides/first.png',
            order=1,
        )

        response = self.client.get('/api/products/hero-slides/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual([slide['title'] for slide in response.data], ['First slide', 'Second slide'])
        self.assertEqual(
            response.data[0]['image'],
            'http://testserver/media/hero_slides/first.png',
        )
