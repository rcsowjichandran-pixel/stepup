from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    image = models.CharField(max_length=255, blank=True)
    is_featured = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['order', 'name']

    def __str__(self):
        return self.name

class SubCategory(models.Model):
    category = models.ForeignKey(Category, related_name='subcategories', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100)

    class Meta:
        unique_together = ('category', 'slug')
        ordering = ['name']

    def __str__(self):
        return f"{self.category.name} - {self.name}"

class Brand(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    logo = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    GENDER_CHOICES = (
        ('Men', 'Men'),
        ('Women', 'Women'),
        ('Kids', 'Kids'),
        ('Unisex', 'Unisex'),
    )

    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    subcategory = models.ForeignKey(SubCategory, related_name='products', on_delete=models.SET_NULL, null=True, blank=True)
    brand = models.ForeignKey(Brand, related_name='products', on_delete=models.SET_NULL, null=True, blank=True)
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, default='Unisex')
    
    price = models.DecimalField(max_digits=10, decimal_places=2)  # Selling price (MRP)
    original_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    discount_percentage = models.PositiveIntegerField(default=0)
    
    description = models.TextField(blank=True)
    image = models.CharField(max_length=255)  # URL or filename in static/images
    
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=4.5)
    reviews_count = models.PositiveIntegerField(default=24)
    
    is_trending = models.BooleanField(default=False)
    is_new = models.BooleanField(default=True)
    in_stock = models.BooleanField(default=True)
    stock_count = models.PositiveIntegerField(default=50)

    # JSON or comma-separated lists
    available_sizes = models.CharField(max_length=100, default='6,7,8,9,10')
    available_colors = models.CharField(max_length=100, default='Black,Grey,Brown')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_trending', '-created_at']

    def __str__(self):
        return self.name


class HeroSlide(models.Model):
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=20)
    image = models.ImageField(upload_to='hero_slides/')
    order = models.PositiveSmallIntegerField(unique=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title
