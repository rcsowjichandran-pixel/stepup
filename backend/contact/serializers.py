from rest_framework import serializers
from .models import ContactEnquiry, NewsletterSubscriber

class ContactEnquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactEnquiry
        fields = ('id', 'name', 'email', 'phone', 'message', 'created_at')

class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = ('id', 'email', 'subscribed_at')
