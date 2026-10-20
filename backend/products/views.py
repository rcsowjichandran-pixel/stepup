from django.db.models import Q
from rest_framework import viewsets, generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Category, Brand, Product, HeroSlide
from .serializers import CategorySerializer, BrandSerializer, ProductSerializer, HeroSlideSerializer

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all().prefetch_related('subcategories')
    serializer_class = CategorySerializer

class BrandListView(generics.ListAPIView):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.all().select_related('category', 'subcategory', 'brand')
    serializer_class = ProductSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        qs = super().get_queryset()
        
        # Category filter
        category = self.request.query_params.get('category')
        if category:
            qs = qs.filter(Q(category__slug=category) | Q(category__name__iexact=category))
            
        # Gender filter
        gender = self.request.query_params.get('gender')
        if gender:
            qs = qs.filter(gender__iexact=gender)

        # Brand filter
        brand = self.request.query_params.get('brand')
        if brand:
            qs = qs.filter(Q(brand__slug=brand) | Q(brand__name__iexact=brand))

        # Trending filter
        trending = self.request.query_params.get('trending')
        if trending and trending.lower() in ['true', '1']:
            qs = qs.filter(is_trending=True)

        # Offers filter
        offers = self.request.query_params.get('offers')
        if offers and offers.lower() in ['true', '1']:
            qs = qs.filter(discount_percentage__gt=0)

        # Search query
        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(
                Q(name__icontains=search) |
                Q(description__icontains=search) |
                Q(category__name__icontains=search) |
                Q(brand__name__icontains=search)
            )

        # Price range
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        if min_price:
            try:
                qs = qs.filter(price__gte=float(min_price))
            except ValueError:
                pass
        if max_price:
            try:
                qs = qs.filter(price__lte=float(max_price))
            except ValueError:
                pass

        # Sort
        ordering = self.request.query_params.get('ordering')
        if ordering:
            if ordering == 'price_low':
                qs = qs.order_by('price')
            elif ordering == 'price_high':
                qs = qs.order_by('-price')
            elif ordering == 'newest':
                qs = qs.order_by('-created_at')
            elif ordering == 'popular':
                qs = qs.order_by('-reviews_count', '-rating')

        return qs

@api_view(['GET'])
def hero_slides_view(request):
    slides = HeroSlide.objects.filter(is_active=True)
    return Response(HeroSlideSerializer(slides, many=True, context={'request': request}).data)
