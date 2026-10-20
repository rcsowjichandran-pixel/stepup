from django.urls import path
from .views import checkout_view, user_orders_view

urlpatterns = [
    path('checkout/', checkout_view, name='order-checkout'),
    path('my-orders/', user_orders_view, name='user-orders'),
]
