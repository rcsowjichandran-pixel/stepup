from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Order
from .serializers import OrderSerializer

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def checkout_view(request):
    data = request.data.copy()
    if request.user.is_authenticated:
        data['user'] = request.user.id
    serializer = OrderSerializer(data=data)
    if serializer.is_valid():
        payment_method = serializer.validated_data.get('payment_method', 'Cash on Delivery')
        order_status = 'Processing' if payment_method == 'Cash on Delivery' else 'Pending'
        order = serializer.save(payment_status='Pending', order_status=order_status)
        return Response({
            'message': 'Order placed successfully! Thank you for shopping with StepUp.',
            'order_id': order.id,
            'total_amount': order.total_amount,
            'payment_method': order.payment_method,
            'payment_status': order.payment_status,
            'order_status': order.order_status,
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_orders_view(request):
    orders = Order.objects.filter(user=request.user)
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)
