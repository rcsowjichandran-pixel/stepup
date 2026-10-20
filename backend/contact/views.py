from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import ContactEnquiry, NewsletterSubscriber
from .serializers import ContactEnquirySerializer, NewsletterSubscriberSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def contact_enquiry_view(request):
    serializer = ContactEnquirySerializer(data=request.data)
    if serializer.is_valid():
        enquiry = serializer.save()
        return Response({
            'message': 'Thank you! Your enquiry has been received. Our team will contact you shortly.',
            'enquiry_id': enquiry.id
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def newsletter_subscribe_view(request):
    email = request.data.get('email', '').strip().lower()
    if not email:
        return Response({'detail': 'Please provide a valid email address.'}, status=status.HTTP_400_BAD_REQUEST)
    
    subscriber, created = NewsletterSubscriber.objects.get_or_create(email=email)
    if created:
        return Response({'message': 'Successfully subscribed to StepUp newsletter! Enjoy 10% off your next purchase.'}, status=status.HTTP_201_CREATED)
    else:
        return Response({'message': 'You are already subscribed to our newsletter!'}, status=status.HTTP_200_OK)
