# Generated migration to fix created_at timezone

from django.db import migrations
from django.utils import timezone

def fix_timestamps(apps, schema_editor):
    WifiAccess = apps.get_model('access', 'WifiAccess')
    # Update all records to use current time with correct timezone
    for record in WifiAccess.objects.all():
        record.created_at = timezone.now()
        record.save()

def reverse_fix(apps, schema_editor):
    # This migration cannot be safely reversed
    pass

class Migration(migrations.Migration):

    dependencies = [
        ('access', '0002_alter_wifiaccess_created_at'),
    ]

    operations = [
        migrations.RunPython(fix_timestamps, reverse_fix),
    ]
