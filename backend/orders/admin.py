from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product_name', 'price', 'quantity', 'size', 'color')


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'full_name', 'created_at', 'total_amount',
        'payment_method', 'payment_status', 'order_status',
    )
    list_filter = ('payment_method', 'payment_status', 'order_status', 'created_at')
    search_fields = ('full_name', 'email', 'phone', 'razorpay_order_id', 'razorpay_payment_id')
    readonly_fields = ('created_at', 'razorpay_order_id', 'razorpay_payment_id')
    inlines = (OrderItemInline,)


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'product_name', 'price', 'quantity', 'size', 'color')
    search_fields = ('product_name', 'order__full_name', 'order__email')
