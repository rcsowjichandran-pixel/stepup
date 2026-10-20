from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, CategoryListView, BrandListView, hero_slides_view

router = DefaultRouter()
router.register(r'items', ProductViewSet, basename='product')

urlpatterns = [
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('brands/', BrandListView.as_view(), name='brand-list'),
    path('hero-slides/', hero_slides_view, name='hero-slides'),
    path('', include(router.urls)),
]
