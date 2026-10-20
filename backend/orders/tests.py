from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient


class CheckoutPaymentStatusTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.checkout_url = reverse('order-checkout')
        self.payload = {
            'full_name': 'Rohan Sharma',
            'email': 'rohan@example.com',
            'phone': '+919876543210',
            'address': '12 Main Street',
            'city': 'Bengaluru',
            'state': 'Karnataka',
            'postal_code': '560001',
            'total_amount': '2799.00',
            'discount_amount': '0.00',
            'cart_items': [],
        }

    def test_online_checkout_stays_pending_until_gateway_confirms_payment(self):
        response = self.client.post(
            self.checkout_url,
            {**self.payload, 'payment_method': 'UPI / GPay'},
            format='json',
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['payment_status'], 'Pending')
        self.assertEqual(response.data['order_status'], 'Pending')

    def test_cash_on_delivery_is_not_marked_paid(self):
        response = self.client.post(
            self.checkout_url,
            {**self.payload, 'payment_method': 'Cash on Delivery'},
            format='json',
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['payment_status'], 'Pending')
        self.assertEqual(response.data['order_status'], 'Processing')
