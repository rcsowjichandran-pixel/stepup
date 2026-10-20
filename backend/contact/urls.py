from django.urls import path
from .views import contact_enquiry_view, newsletter_subscribe_view

urlpatterns = [
    path('enquiry/', contact_enquiry_view, name='contact-enquiry'),
    path('newsletter/', newsletter_subscribe_view, name='newsletter-subscribe'),
]
