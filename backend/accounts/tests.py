from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APIClient


class RegistrationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('auth_register')

    def register(self, email):
        return self.client.post(
            self.register_url,
            {
                'email': email,
                'password': 'secure-pass-123',
                'first_name': 'Rohan',
                'last_name': 'Sharma',
            },
            format='json',
        )

    def test_registration_generates_username_when_form_does_not_send_one(self):
        response = self.register('rohan@example.com')

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['user']['username'], 'rohan')
        self.assertTrue(response.data['tokens']['access'])
        self.assertTrue(User.objects.get(email='rohan@example.com').check_password('secure-pass-123'))

    def test_registration_generates_unique_username_for_existing_email_prefix(self):
        User.objects.create_user(username='rohan', email='existing@example.com', password='secure-pass-123')

        response = self.register('rohan@example.com')

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['user']['username'], 'rohan1')
