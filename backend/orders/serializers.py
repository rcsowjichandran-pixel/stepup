from rest_framework import serializers
from .models import Order, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ('id', 'product', 'product_name', 'price', 'quantity', 'size', 'color')

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    cart_items = serializers.ListField(child=serializers.DictField(), write_only=True, required=True)

    class Meta:
        model = Order
        fields = (
            'id', 'user', 'full_name', 'email', 'phone', 'address', 'city',
            'state', 'postal_code', 'total_amount', 'discount_amount',
            'payment_method', 'payment_status', 'order_status', 'created_at',
            'items', 'cart_items'
        )
        read_only_fields = ('id', 'created_at', 'order_status', 'payment_status')

    def create(self, validated_data):
        cart_items = validated_data.pop('cart_items', [])
        order = Order.objects.create(**validated_data)
        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                product_id=item.get('product_id'),
                product_name=item.get('name', 'Footwear'),
                price=item.get('price', 0),
                quantity=item.get('quantity', 1),
                size=item.get('size', ''),
                color=item.get('color', '')
            )
        return order
