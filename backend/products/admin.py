from django.contrib import admin
from .models import HeroSlide


@admin.register(HeroSlide)
class HeroSlideAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'order', 'is_active')
    list_editable = ('order', 'is_active')
    ordering = ('order',)
