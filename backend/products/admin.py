from django.contrib import admin
from .models import Brand, Category, HeroSlide, Product, SubCategory


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'order', 'is_featured')
    list_editable = ('order', 'is_featured')
    search_fields = ('name', 'slug')
    ordering = ('order', 'name')


@admin.register(SubCategory)
class SubCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'slug')
    list_filter = ('category',)
    search_fields = ('name', 'slug')


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    search_fields = ('name', 'slug')


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'brand', 'price', 'is_trending', 'in_stock')
    list_filter = ('category', 'gender', 'is_trending', 'is_new', 'in_stock')
    search_fields = ('name', 'slug', 'description')


@admin.register(HeroSlide)
class HeroSlideAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'order', 'is_active')
    list_editable = ('order', 'is_active')
    ordering = ('order',)
