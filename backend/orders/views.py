import hashlib
import hmac
import json
import base64
from decimal import Decimal
from urllib.request import Request, urlopen

from django.conf import settings
from django.db import transaction
from rest_framework import permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from products.models import Product
from .models import Order
from .serializers import OrderSerializer


def _razorpay_client():
    if not settings.RAZORPAY_KEY_ID or not settings.RAZORPAY_KEY_SECRET:
        return False
    return True


def _razorpay_api_request(endpoint, payload=None):
    credentials = f'{settings.RAZORPAY_KEY_ID}:{settings.RAZORPAY_KEY_SECRET}'.encode()
    authorization = base64.b64encode(credentials).decode()
    body = json.dumps(payload).encode() if payload is not None else None
    request = Request(
        f'https://api.razorpay.com/v1/{endpoint}',
        data=body,
        headers={
            'Authorization': f'Basic {authorization}',
            'Content-Type': 'application/json',
        },
        method='POST' if body is not None else 'GET',
    )
    with urlopen(request, timeout=15) as response:
        return json.loads(response.read())


def _price_cart_items(raw_items):
    if not isinstance(raw_items, list) or not raw_items:
        raise ValueError('Your cart is empty.')

    priced_items = []
    subtotal = Decimal('0.00')
    for item in raw_items:
        try:
            product_id = int(item.get('product_id'))
            quantity = int(item.get('quantity', 1))
        except (AttributeError, TypeError, ValueError):
            raise ValueError('A cart item is invalid.')
        if quantity < 1 or quantity > 20:
            raise ValueError('Each item quantity must be between 1 and 20.')

        product = Product.objects.filter(pk=product_id, in_stock=True).first()
        if not product:
            raise ValueError('A product in your cart is unavailable.')
        if product.stock_count < quantity:
            raise ValueError(f'Only {product.stock_count} of {product.name} are currently in stock.')

        price = product.price
        subtotal += price * quantity
        priced_items.append({
            'product_id': product.pk,
            'name': product.name,
            'price': str(price),
            'quantity': quantity,
            'size': str(item.get('size', ''))[:20],
            'color': str(item.get('color', ''))[:50],
        })

    return priced_items, subtotal


def _coupon_discount(code, subtotal):
    rates = {'STEPUP50': Decimal('0.50'), 'OFFER50': Decimal('0.50'), 'STEPUP10': Decimal('0.10')}
    rate = rates.get(str(code or '').strip().upper(), Decimal('0'))
    return (subtotal * rate).quantize(Decimal('0.01'))


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def checkout_view(request):
    client = _razorpay_client()
    payment_method = str(request.data.get('payment_method', 'Cash on Delivery'))
    online_payment = payment_method == 'Razorpay'
    if online_payment and not client:
        return Response({'detail': 'Online payments are not configured on the server.'}, status=503)

    data = request.data.copy()
    if request.user.is_authenticated:
        data['user'] = request.user.id
    else:
        data.pop('user', None)
    try:
        priced_items, subtotal = _price_cart_items(data.get('cart_items'))
    except (ValueError, TypeError) as error:
        return Response({'detail': str(error)}, status=status.HTTP_400_BAD_REQUEST)

    discount = _coupon_discount(data.get('coupon_code'), subtotal)
    total = max(Decimal('0.00'), subtotal - discount)
    if online_payment and total <= 0:
        return Response({'detail': 'The order total must be greater than zero for online payment.'}, status=400)

    data['cart_items'] = priced_items
    data['total_amount'] = total
    data['discount_amount'] = discount
    data['payment_method'] = 'Razorpay' if online_payment else 'Cash on Delivery'
    serializer = OrderSerializer(data=data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    order_status = 'Pending' if online_payment else 'Processing'
    with transaction.atomic():
        order = serializer.save(payment_status='Pending', order_status=order_status)
        if online_payment:
            try:
                gateway_order = _razorpay_api_request('orders', {
                    'amount': int(total * 100),
                    'currency': 'INR',
                    'receipt': f'stepup_{order.id}',
                    'notes': {'stepup_order_id': str(order.id)},
                })
            except Exception:
                transaction.set_rollback(True)
                return Response({'detail': 'Could not start Razorpay checkout. Please try again.'}, status=502)
            order.razorpay_order_id = gateway_order['id']
            order.save(update_fields=['razorpay_order_id'])

    response_data = {
        'message': 'Order created. Complete payment to confirm it.' if online_payment else 'Order placed successfully.',
        'order_id': order.id,
        'total_amount': str(order.total_amount),
        'payment_method': order.payment_method,
        'payment_status': order.payment_status,
        'order_status': order.order_status,
    }
    if online_payment:
        response_data.update({
            'razorpay_order_id': order.razorpay_order_id,
            'razorpay_key_id': settings.RAZORPAY_KEY_ID,
            'currency': 'INR',
            'amount': int(total * 100),
        })
    return Response(response_data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def verify_payment_view(request):
    client = _razorpay_client()
    if not client:
        return Response({'detail': 'Online payments are not configured on the server.'}, status=503)

    order_id = request.data.get('order_id')
    payment_id = request.data.get('razorpay_payment_id')
    signature = request.data.get('razorpay_signature')
    if not all((order_id, payment_id, signature)):
        return Response({'detail': 'Payment verification details are incomplete.'}, status=400)
    order = Order.objects.filter(pk=order_id, payment_method='Razorpay').first()
    if not order or not order.razorpay_order_id:
        return Response({'detail': 'Order not found.'}, status=404)

    signed_payload = f'{order.razorpay_order_id}|{payment_id}'.encode()
    expected_signature = hmac.new(
        settings.RAZORPAY_KEY_SECRET.encode(), signed_payload, hashlib.sha256
    ).hexdigest()
    if not hmac.compare_digest(expected_signature, str(signature)):
        return Response({'detail': 'Payment signature could not be verified.'}, status=400)

    try:
        payment = _razorpay_api_request(f'payments/{payment_id}')
    except Exception:
        return Response({'detail': 'Could not confirm payment status. Please retry shortly.'}, status=502)
    if payment.get('order_id') != order.razorpay_order_id:
        return Response({'detail': 'Payment does not match this order.'}, status=400)
    if payment.get('amount') != int(order.total_amount * 100) or payment.get('currency') != 'INR':
        return Response({'detail': 'Payment amount does not match this order.'}, status=400)

    order.razorpay_payment_id = payment_id
    if payment.get('status') == 'captured':
        order.payment_status = 'Paid'
        order.order_status = 'Processing'
    order.save(update_fields=['razorpay_payment_id', 'payment_status', 'order_status'])
    return Response({
        'order_id': order.id,
        'payment_status': order.payment_status,
        'order_status': order.order_status,
    })


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def razorpay_webhook_view(request):
    webhook_secret = settings.RAZORPAY_WEBHOOK_SECRET
    signature = request.headers.get('X-Razorpay-Signature', '')
    if not webhook_secret:
        return Response({'detail': 'Webhook is not configured.'}, status=503)
    expected = hmac.new(webhook_secret.encode(), request.body, hashlib.sha256).hexdigest()
    if not signature or not hmac.compare_digest(expected, signature):
        return Response({'detail': 'Invalid webhook signature.'}, status=400)

    try:
        payload = json.loads(request.body)
        event = payload.get('event')
        entity = payload['payload']['payment']['entity']
    except (ValueError, KeyError, TypeError):
        return Response({'detail': 'Invalid webhook payload.'}, status=400)

    gateway_order_id = entity.get('order_id')
    order = Order.objects.filter(razorpay_order_id=gateway_order_id).first()
    if not order:
        return Response({'received': True})
    if event == 'payment.captured' or entity.get('status') == 'captured':
        order.razorpay_payment_id = entity.get('id', order.razorpay_payment_id)
        order.payment_status = 'Paid'
        order.order_status = 'Processing'
        order.save(update_fields=['razorpay_payment_id', 'payment_status', 'order_status'])
    elif event == 'payment.failed' and order.payment_status == 'Pending':
        order.payment_status = 'Failed'
        order.save(update_fields=['payment_status'])
    return Response({'received': True})


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_orders_view(request):
    orders = Order.objects.filter(user=request.user)
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)
