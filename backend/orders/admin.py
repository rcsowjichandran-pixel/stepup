from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    can_delete = False
    readonly_fields = ('product', 'product_name', 'price', 'quantity', 'size', 'color')


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'full_name', 'created_at', 'total_amount',
        'payment_method', 'payment_status', 'order_status',
    )
    list_filter = ('payment_method', 'payment_status', 'order_status', 'created_at')
    search_fields = ('full_name', 'email', 'phone', 'razorpay_order_id', 'razorpay_payment_id')
    readonly_fields = ('created_at',)
    inlines = (OrderItemInline,)


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'product_name', 'price', 'quantity', 'size', 'color')
    search_fields = ('order__id', 'product_name', 'product__name')
    list_filter = ('size', 'color')

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
