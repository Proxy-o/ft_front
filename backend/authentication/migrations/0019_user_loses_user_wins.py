# Generated by Django 4.1.7 on 2024-11-15 14:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0018_user_score'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='loses',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='user',
            name='wins',
            field=models.IntegerField(default=0),
        ),
    ]
