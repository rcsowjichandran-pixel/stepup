from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from unittest.mock import patch

from .models import Order
from .views import _get_razorpay_customer_id


class RazorpayCustomerTests(TestCase):
    def make_order(self, email='rohan@example.com', phone='+91 98765 43210'):
        return Order.objects.create(
            full_name='Rohan Sharma',
            email=email,
            phone=phone,
            address='12 Main Street',
            city='Bengaluru',
            state='Karnataka',
            postal_code='560001',
            total_amount='2799.00',
        )

    @patch('orders.views._razorpay_api_request')
    def test_creates_customer_and_saves_customer_id_on_order(self, api_request):
        api_request.return_value = {'id': 'cust_test123'}
        order = self.make_order()

        customer_id = _get_razorpay_customer_id(order)

        self.assertEqual(customer_id, 'cust_test123')
        api_request.assert_called_once_with('customers', {
            'name': 'Rohan Sharma',
            'email': 'rohan@example.com',
            'contact': '+919876543210',
            'fail_existing': '0',
        })
        order.refresh_from_db()
        self.assertEqual(order.razorpay_customer_id, 'cust_test123')

    @patch('orders.views._razorpay_api_request')
    def test_reuses_customer_for_matching_email_and_phone(self, api_request):
        existing_order = self.make_order()
        existing_order.razorpay_customer_id = 'cust_existing'
        existing_order.save(update_fields=['razorpay_customer_id'])
        new_order = self.make_order()

        customer_id = _get_razorpay_customer_id(new_order)

        self.assertEqual(customer_id, 'cust_existing')
        api_request.assert_not_called()


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
