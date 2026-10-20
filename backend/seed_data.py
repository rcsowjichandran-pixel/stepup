import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'stepup_backend.settings')
django.setup()

from django.contrib.auth.models import User
from products.models import Category, SubCategory, Brand, Product

def seed():
    print("Seeding StepUp database...")

    # 1. Superuser & Demo User
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@stepup.in', 'admin123')
        print("Created superuser: admin / admin123")

    if not User.objects.filter(username='demo_user').exists():
        demo = User.objects.create_user('demo_user', 'user@stepup.in', 'user123', first_name='Rohan', last_name='Sharma')
        print("Created demo user: user@stepup.in / user123")

    # 2. Categories
    cat_women, _ = Category.objects.get_or_create(
        slug='women',
        defaults={'name': 'Women', 'description': 'Elegant and comfortable footwear for women', 'image': '/images/category_women.png', 'order': 1}
    )
    cat_men, _ = Category.objects.get_or_create(
        slug='men',
        defaults={'name': 'Men', 'description': 'Refined casual, formal and athletic shoes for men', 'image': '/images/category_men.png', 'order': 2}
    )
    cat_kids, _ = Category.objects.get_or_create(
        slug='kids',
        defaults={'name': 'Kids', 'description': 'Playful, supportive and durable shoes for boys & girls', 'image': '/images/category_kids.png', 'order': 3}
    )
    cat_brands, _ = Category.objects.get_or_create(
        slug='brands',
        defaults={'name': 'Brands', 'description': 'Top global and national shoe brands', 'image': '', 'order': 4}
    )
    cat_offers, _ = Category.objects.get_or_create(
        slug='offers',
        defaults={'name': 'Offers', 'description': 'Special discounts, clearances and festive deals', 'image': '', 'order': 5}
    )

    # 3. Subcategories
    sub_women_heels, _ = SubCategory.objects.get_or_create(category=cat_women, slug='heels', defaults={'name': 'Glamour Heels'})
    sub_women_slipon, _ = SubCategory.objects.get_or_create(category=cat_women, slug='slip-ons', defaults={'name': 'Slip-On Shoes'})
    sub_women_casual, _ = SubCategory.objects.get_or_create(category=cat_women, slug='casuals', defaults={'name': 'Casual Sneakers'})
    sub_women_flats, _ = SubCategory.objects.get_or_create(category=cat_women, slug='flats', defaults={'name': 'Flats & Sandals'})

    sub_men_sneakers, _ = SubCategory.objects.get_or_create(category=cat_men, slug='lace-up-sneakers', defaults={'name': 'Lace-Up Sneakers'})
    sub_men_formal, _ = SubCategory.objects.get_or_create(category=cat_men, slug='formal-shoes', defaults={'name': 'Office Formal Shoes'})
    sub_men_loafers, _ = SubCategory.objects.get_or_create(category=cat_men, slug='loafers', defaults={'name': 'Loafers & Slip-Ons'})
    sub_men_athletic, _ = SubCategory.objects.get_or_create(category=cat_men, slug='sports-running', defaults={'name': 'Sports & Running'})

    sub_kids_boys, _ = SubCategory.objects.get_or_create(category=cat_kids, slug='boys-footwear', defaults={'name': 'Boys Footwear'})
    sub_kids_girls, _ = SubCategory.objects.get_or_create(category=cat_kids, slug='girls-footwear', defaults={'name': 'Girls Footwear'})
    sub_kids_sandals, _ = SubCategory.objects.get_or_create(category=cat_kids, slug='kids-sandals', defaults={'name': 'Kids Sandals'})

    # 4. Brands
    brand_stepup, _ = Brand.objects.get_or_create(slug='stepup-originals', defaults={'name': 'StepUp Originals'})
    brand_nike, _ = Brand.objects.get_or_create(slug='nike', defaults={'name': 'Nike'})
    brand_adidas, _ = Brand.objects.get_or_create(slug='adidas', defaults={'name': 'Adidas'})
    brand_puma, _ = Brand.objects.get_or_create(slug='puma', defaults={'name': 'Puma'})
    brand_sparx, _ = Brand.objects.get_or_create(slug='sparx', defaults={'name': 'Sparx'})
    brand_bata, _ = Brand.objects.get_or_create(slug='bata', defaults={'name': 'Bata'})
    brand_campus, _ = Brand.objects.get_or_create(slug='campus', defaults={'name': 'Campus'})

    # 5. Products - EXACT products matching Figma Screenshots
    products_data = [
        # Cart Page Featured Shoe
        {
            "name": "Comfy Steps",
            "slug": "comfy-steps-mens-classic-shoe",
            "category": cat_men,
            "subcategory": sub_men_loafers,
            "brand": brand_stepup,
            "gender": "Men",
            "price": 2799.00,
            "original_price": 2499.00,
            "discount_percentage": 30,
            "description": "Men's wear Pure Classic Shoe with ergonomic cushion insole and all-day walking comfort.",
            "image": "/images/shoe_item_4.png",
            "rating": 4.9,
            "reviews_count": 98,
            "is_trending": False,
            "is_new": True,
            "available_sizes": "6,7,8,9,10,11",
            "available_colors": "Classic Tan,Brown,Black"
        },
        # Figma Row 1
        {
            "name": "Ophelia Womens Silver Diamond Heel",
            "slug": "ophelia-women-silver-glamour-heel",
            "category": cat_women,
            "subcategory": sub_women_heels,
            "brand": brand_stepup,
            "gender": "Women",
            "price": 2299.00,
            "original_price": 3499.00,
            "discount_percentage": 34,
            "description": "Exquisite silver metallic finish stiletto heel with comfort-padded insole and secure ankle buckle strap. Ideal for weddings, cocktail galas, and festive evenings.",
            "image": "/images/product_ophelia_silver.png",
            "rating": 4.8,
            "reviews_count": 86,
            "is_trending": True,
            "is_new": True,
            "available_sizes": "4,5,6,7,8",
            "available_colors": "Silver,Gold,Rose Gold"
        },
        {
            "name": "Millie Womens Silver Diamond Heel",
            "slug": "millie-women-silver-glamour-heel",
            "category": cat_women,
            "subcategory": sub_women_heels,
            "brand": brand_stepup,
            "gender": "Women",
            "price": 1999.00,
            "original_price": 2999.00,
            "discount_percentage": 33,
            "description": "Block-heel elegance crafted in shimmering textured silver. Provides steady stride support with luxury padded leatherette footbed.",
            "image": "/images/product_millie_silver.png",
            "rating": 4.7,
            "reviews_count": 64,
            "is_trending": True,
            "is_new": True,
            "available_sizes": "5,6,7,8",
            "available_colors": "Silver,Metallic Pewter"
        },
        {
            "name": "Drew Womens Blush Diamond Slip-On",
            "slug": "upn-women-blush-slip-on-shoe",
            "category": cat_women,
            "subcategory": sub_women_slipon,
            "brand": brand_stepup,
            "gender": "Women",
            "price": 1499.00,
            "original_price": 2199.00,
            "discount_percentage": 32,
            "description": "Featherlight breathable knit slip-on shoe in romantic blush pink with ergonomic cloud cushioning. Perfect for daily walking and desk-to-dinner comfort.",
            "image": "/images/product_upn_blush.png",
            "rating": 4.9,
            "reviews_count": 128,
            "is_trending": True,
            "is_new": True,
            "available_sizes": "5,6,7,8,9",
            "available_colors": "Blush Pink,Lavender,Cream"
        },
        {
            "name": "Drew Womens Navy Diamond Slip-On",
            "slug": "upn-women-navy-slip-on-shoe",
            "category": cat_women,
            "subcategory": sub_women_slipon,
            "brand": brand_stepup,
            "gender": "Women",
            "price": 1499.00,
            "original_price": 2199.00,
            "discount_percentage": 32,
            "description": "Classic navy stretch-knit walking shoe engineered with shock-absorbent outsole and contour arch support for effortless daily strides.",
            "image": "/images/product_upn_navy.png",
            "rating": 4.8,
            "reviews_count": 112,
            "is_trending": True,
            "is_new": True,
            "available_sizes": "5,6,7,8,9",
            "available_colors": "Navy Blue,Charcoal Grey"
        },

        # Figma Row 2
        {
            "name": "Weaver Mens Navy Lace Up Trainer",
            "slug": "men-black-navy-lace-up-sneaker",
            "category": cat_men,
            "subcategory": sub_men_sneakers,
            "brand": brand_stepup,
            "gender": "Men",
            "price": 1799.00,
            "original_price": 2599.00,
            "discount_percentage": 30,
            "description": "Dynamic multi-tone cushioned sneaker engineered with heavy-duty traction grip and high rebound EVA foam midsole.",
            "image": "/images/shoe_item_5.png",
            "rating": 4.6,
            "reviews_count": 94,
            "is_trending": True,
            "is_new": True,
            "available_sizes": "6,7,8,9,10,11",
            "available_colors": "Black Navy,All Black,Steel Grey"
        },
        {
            "name": "Weaver Mens White Lace Up Trainer",
            "slug": "power-men-white-lace-up-sneaker",
            "category": cat_men,
            "subcategory": sub_men_sneakers,
            "brand": brand_stepup,
            "gender": "Men",
            "price": 2199.00,
            "original_price": 3299.00,
            "discount_percentage": 33,
            "description": "Clean minimalist street style athletic sneaker in crisp white leatherette with bold contrasting side accents and anti-fatigue insole.",
            "image": "/images/product_power_men_white.png",
            "rating": 4.9,
            "reviews_count": 145,
            "is_trending": True,
            "is_new": True,
            "available_sizes": "7,8,9,10,11",
            "available_colors": "White Red,White Black,Pure White"
        },
        {
            "name": "Calista Girls Pink Daisy Print Sandal",
            "slug": "canny-kids-pink-daisy-print-sandal",
            "category": cat_kids,
            "subcategory": sub_kids_girls,
            "brand": brand_stepup,
            "gender": "Kids",
            "price": 899.00,
            "original_price": 1299.00,
            "discount_percentage": 31,
            "description": "Adorable daisy floral appliqué strap sandals with gentle cushioned footbed and quick-fastening velcro strap for happy little feet.",
            "image": "/images/product_canny_kids_pink.png",
            "rating": 4.8,
            "reviews_count": 52,
            "is_trending": True,
            "is_new": True,
            "available_sizes": "2,3,4,5,6",
            "available_colors": "Pink Daisy,Yellow Sunflower"
        },
        {
            "name": "Colby Boys Blue Dinosaur Canvas",
            "slug": "canny-boys-blue-dinosaur-print-sneaker",
            "category": cat_kids,
            "subcategory": sub_kids_boys,
            "brand": brand_stepup,
            "gender": "Kids",
            "price": 1099.00,
            "original_price": 1599.00,
            "discount_percentage": 31,
            "description": "Vibrant dinosaur motif athletic sneaker equipped with non-slip grooved rubber base and lightweight breathable upper mesh.",
            "image": "/images/product_canny_boys_blue.png",
            "rating": 4.9,
            "reviews_count": 78,
            "is_trending": True,
            "is_new": True,
            "available_sizes": "1,2,3,4,5",
            "available_colors": "Dino Blue,Jurassic Green"
        },

        # Hero & Additional Catalog Shoes
        {
            "name": "Urban Territory Men's Black Work Boots",
            "slug": "mens-high-heel-burnished-leather-office-shoe",
            "category": cat_men,
            "subcategory": sub_men_formal,
            "brand": brand_stepup,
            "gender": "Men",
            "price": 2799.00,
            "original_price": 4699.00,
            "discount_percentage": 40,
            "description": "Rugged black lace-up work boots with a supportive padded collar and grippy outdoor sole.",
            "image": "/images/shoe_item_9.png",
            "rating": 5.0,
            "reviews_count": 210,
            "is_trending": False,
            "is_new": True,
            "available_sizes": "7,8,9,10,11,12",
            "available_colors": "Tan Brown,Mahogany,Classic Black"
        },
        {
            "name": "Osaga Neptunes Mens Lace Up Trainer",
            "slug": "aerostep-cloud-running-sneakers",
            "category": cat_men,
            "subcategory": sub_men_athletic,
            "brand": brand_nike,
            "gender": "Men",
            "price": 3499.00,
            "original_price": 4999.00,
            "discount_percentage": 30,
            "description": "Lightweight blue running trainer with a breathable upper and cushioned sole for daily comfort.",
            "image": "/images/shoe_item_11.png",
            "rating": 4.7,
            "reviews_count": 89,
            "is_trending": False,
            "is_new": True,
            "available_sizes": "7,8,9,10,11",
            "available_colors": "Charcoal,Electric Blue"
        },
        {
            "name": "Lenore Tan Leather Formal Loafers",
            "slug": "lenore-tan-leather-formal-loafers",
            "category": cat_men,
            "subcategory": sub_men_loafers,
            "brand": brand_stepup,
            "gender": "Men",
            "price": 3739.00,
            "original_price": 4999.00,
            "discount_percentage": 25,
            "description": "Classic tan leather formal loafers with a polished finish and a comfortable low-profile sole.",
            "image": "/images/shoe_item_15.png",
            "rating": 4.8,
            "reviews_count": 45,
            "is_trending": False,
            "is_new": False,
            "available_sizes": "7,8,9,10,11",
            "available_colors": "Tan,Brown,Black"
        },
        {
            "name": "Spider-Man Kids Red Light Up Trainer",
            "slug": "spider-man-kids-red-light-up-trainer",
            "category": cat_kids,
            "subcategory": sub_kids_boys,
            "brand": brand_puma,
            "gender": "Kids",
            "price": 1299.00,
            "original_price": 1899.00,
            "discount_percentage": 31,
            "description": "Bright red and navy kids' trainer with a supportive fit and easy fastening straps.",
            "image": "/images/shoe_item_32.png",
            "rating": 4.9,
            "reviews_count": 67,
            "is_trending": False,
            "is_new": True,
            "available_sizes": "1,2,3,4,5",
            "available_colors": "Lightning Red,Cosmic Blue"
        }
    ]

    collection_items = [
        # Men's collection (the remaining images in the reference grid).
        ('Double Strap Sandals', 'double-strap-sandals', cat_men, sub_men_loafers, 'men', 6, 999, '7,8,9,10,11', 'Tan,Brown,Black'),
        ('Comfy Steps White Leather Slippers', 'comfy-steps-white-leather-slippers', cat_men, sub_men_loafers, 'men', 7, 1995, '7,8,9,10,11', 'White,Grey,Black'),
        ('Urban Territory Brown Lace Up Boots', 'urban-territory-brown-lace-up-boots', cat_men, sub_men_formal, 'men', 8, 2999, '7,8,9,10,11', 'Brown,Tan,Black'),
        ('Mateo Leather Lace-up Sneakers', 'mateo-leather-lace-up-sneakers', cat_men, sub_men_sneakers, 'men', 10, 899, '6,7,8,9,10,11', 'Brown,Black,Tan'),
        ('Leather Ethnic Sandals', 'mens-leather-ethnic-sandals', cat_men, sub_men_loafers, 'men', 12, 3995, '7,8,9,10,11', 'Black,Brown'),
        ('Herfa Hand Painted Tan Leather Sandals', 'herfa-hand-painted-leather-sandals', cat_men, sub_men_loafers, 'men', 13, 4999, '7,8,9,10,11', 'Tan,Brown'),
        ('Lucas Luxury Leather Loafers', 'lucas-luxury-leather-loafers', cat_men, sub_men_loafers, 'men', 14, 999, '7,8,9,10,11', 'Black,Brown'),

        # Women's collection.
        ('Lunar Taney Womens Lilac Sandal', 'lunar-taney-womens-lilac-sandal', cat_women, sub_women_flats, 'women', 16, 999, '4,5,6,7,8', 'Lilac,Beige'),
        ('Lilley Dew Womens Diamante Slip Shoe', 'lilley-dew-diamante-slip-shoe', cat_women, sub_women_slipon, 'women', 17, 7699, '4,5,6,7,8', 'White,Silver'),
        ('Softlines Sea Womens Navy Sandal', 'softlines-sea-womens-navy-sandal', cat_women, sub_women_flats, 'women', 18, 3699, '4,5,6,7,8', 'Navy,Black'),
        ('Sheozone Womens Floral Beach Mule', 'sheozone-womens-floral-beach-mule', cat_women, sub_women_flats, 'women', 19, 2799, '4,5,6,7,8', 'Blue,White'),
        ('TrentFit Womens Silver Heel', 'trentfit-womens-silver-heel', cat_women, sub_women_heels, 'women', 20, 4999, '4,5,6,7,8', 'Silver'),
        ('Nochelle Mesh Row Ballerinas', 'nochelle-mesh-row-ballerinas', cat_women, sub_women_flats, 'women', 21, 3999, '4,5,6,7,8', 'Black,Beige'),
        ('Lilley Authentics Patent Lace Shoe', 'lilley-authentics-patent-lace-shoe', cat_women, sub_women_casual, 'women', 22, 7879, '4,5,6,7,8', 'Black'),
        ('Stella Flat Embellished Sliders', 'stella-flat-embellished-sliders', cat_women, sub_women_flats, 'women', 23, 1999, '4,5,6,7,8', 'Silver,Gold'),
        ('Olivia Pencil Heels', 'olivia-pencil-heels', cat_women, sub_women_heels, 'women', 24, 8199, '4,5,6,7,8', 'Black'),
        ('Amelia Kitten Heels', 'amelia-kitten-heels', cat_women, sub_women_heels, 'women', 25, 3669, '4,5,6,7,8', 'Beige,Cream'),
        ('Beckett Sandals', 'beckett-womens-sandals', cat_women, sub_women_flats, 'women', 26, 3999, '4,5,6,7,8', 'White,Tan'),
        ('Gitano Flat Black Elastic Sandals', 'gitano-flat-black-elastic-sandals', cat_women, sub_women_flats, 'women', 27, 1799, '4,5,6,7,8', 'Black,Tan'),

        # Kids' collection.
        ('Whity Girls White Multi Marble EVA Clog', 'whity-girls-white-marble-eva-clog', cat_kids, sub_kids_girls, 'kids', 28, 2799, '10,11,12,13,1,2,3,4,5', 'White,Lilac'),
        ('Walkright Girls Blue Easter Canvas Shoes', 'walkright-girls-blue-easter-canvas', cat_kids, sub_kids_girls, 'kids', 29, 3199, '10,11,12,13,1,2,3,4,5', 'Blue'),
        ('Walkright Girls Pink Polka Dot Canvas Shoes', 'walkright-girls-pink-polka-dot-canvas', cat_kids, sub_kids_girls, 'kids', 30, 2699, '10,11,12,13,1,2,3,4,5', 'Pink'),
        ('Walkright Girls Multi Strap Sandal', 'walkright-girls-multi-strap-sandal', cat_kids, sub_kids_girls, 'kids', 31, 4799, '10,11,12,13,1,2,3,4,5', 'White,Pink'),
        ('Bluey Kids Blue Easy Fashion Slipper', 'bluey-kids-blue-fashion-slipper', cat_kids, sub_kids_boys, 'kids', 33, 4499, '10,11,12,13,1,2,3,4,5', 'Blue'),
        ('LOL Surprise Kids Fashion Slipper', 'lol-surprise-kids-fashion-slipper', cat_kids, sub_kids_girls, 'kids', 34, 2799, '10,11,12,13,1,2,3,4,5', 'Pink'),
        ('Cherish Girls Pink Booties', 'cherish-girls-pink-booties', cat_kids, sub_kids_girls, 'kids', 35, 2999, '10,11,12,13,1,2,3,4,5', 'Pink'),
        ('Disney Stitch Kids Multi EVA Clogs', 'disney-stitch-kids-eva-clogs', cat_kids, sub_kids_girls, 'kids', 36, 3999, '10,11,12,13,1,2,3,4,5', 'Blue,Pink'),
        ('Disney Frozen Sparkle Kids Purple Sandal', 'disney-frozen-purple-kids-sandal', cat_kids, sub_kids_girls, 'kids', 37, 5599, '10,11,12,13,1,2,3,4,5', 'Purple'),
        ('Sheozone Kids Black Welly Boots', 'sheozone-kids-black-welly-boots', cat_kids, sub_kids_boys, 'kids', 38, 4999, '10,11,12,13,1,2,3,4,5', 'Black'),
        ('Sheozone Character Glitter Unicorn Welly', 'sheozone-unicorn-glitter-welly', cat_kids, sub_kids_girls, 'kids', 39, 3799, '10,11,12,13,1,2,3,4,5', 'Purple,Pink'),
    ]

    for name, slug, category, subcategory, gender, image_number, price, sizes, colors in collection_items:
        products_data.append({
            "name": name,
            "slug": slug,
            "category": category,
            "subcategory": subcategory,
            "brand": brand_stepup,
            "gender": gender.title(),
            "price": price,
            "original_price": round(price * 1.35),
            "discount_percentage": 25,
            "description": f"{name}, selected for everyday comfort and dependable wear.",
            "image": f"/images/shoe_item_{image_number}.png",
            "rating": 4.6,
            "reviews_count": 24,
            "is_trending": False,
            "is_new": True,
            "available_sizes": sizes,
            "available_colors": colors,
        })

    Product.objects.filter(slug='aurora-velvet-party-block-heels').update(
        slug='lenore-tan-leather-formal-loafers',
    )
    Product.objects.filter(slug='stepup-kids-marvel-lightning-sneaker').update(
        slug='spider-man-kids-red-light-up-trainer',
    )

    for pdata in products_data:
        p, created = Product.objects.update_or_create(
            slug=pdata['slug'],
            defaults=pdata
        )
        if created:
            print(f"Created product: {p.name}")
        else:
            print(f"Updated product: {p.name}")

    print("Database seeding completed successfully!")

if __name__ == '__main__':
    seed()
