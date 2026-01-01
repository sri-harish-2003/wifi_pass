from django.db import models

class WifiAccess(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    otp = models.CharField(max_length=6)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.email} - Verified: {self.is_verified}"
