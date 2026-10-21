from django.urls import path
from .views import checkout_view, verify_payment_view, razorpay_webhook_view, user_orders_view

urlpatterns = [
    path('checkout/', checkout_view, name='order-checkout'),
    path('verify-payment/', verify_payment_view, name='verify-payment'),
    path('razorpay-webhook/', razorpay_webhook_view, name='razorpay-webhook'),
    path('my-orders/', user_orders_view, name='user-orders'),
]
