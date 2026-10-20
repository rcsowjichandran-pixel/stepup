from rest_framework import serializers
from .models import Category, SubCategory, Brand, Product, HeroSlide


class HeroSlideSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeroSlide
        fields = ('id', 'title', 'category', 'image', 'order')

class SubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SubCategory
        fields = ('id', 'name', 'slug')

class CategorySerializer(serializers.ModelSerializer):
    subcategories = SubCategorySerializer(many=True, read_only=True)
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ('id', 'name', 'slug', 'description', 'image', 'is_featured', 'order', 'subcategories', 'product_count')

    def get_product_count(self, obj):
        return obj.products.count()

class BrandSerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Brand
        fields = ('id', 'name', 'slug', 'logo', 'product_count')

    def get_product_count(self, obj):
        return obj.products.count()

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    subcategory_name = serializers.CharField(source='subcategory.name', read_only=True)
    brand_name = serializers.CharField(source='brand.name', read_only=True)
    sizes = serializers.SerializerMethodField()
    colors = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = (
            'id', 'name', 'slug', 'category', 'category_name', 'category_slug',
            'subcategory', 'subcategory_name', 'brand', 'brand_name', 'gender',
            'price', 'original_price', 'discount_percentage', 'description',
            'image', 'rating', 'reviews_count', 'is_trending', 'is_new',
            'in_stock', 'stock_count', 'sizes', 'colors', 'created_at'
        )

    def get_sizes(self, obj):
        if obj.available_sizes:
            return [s.strip() for s in obj.available_sizes.split(',') if s.strip()]
        return ['6', '7', '8', '9', '10']

    def get_colors(self, obj):
        if obj.available_colors:
            return [c.strip() for c in obj.available_colors.split(',') if c.strip()]
        return ['Default']
