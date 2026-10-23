from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0003_order_razorpay_ids'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='razorpay_customer_id',
            field=models.CharField(blank=True, default='', max_length=100),
        ),
    ]
