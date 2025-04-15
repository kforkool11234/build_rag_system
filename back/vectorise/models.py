from django.db import models
from django.contrib.auth.models import User
from django.db import models
# Create your models here.
class UserCollection(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='collections')
    c_name = models.CharField(max_length=255)  # Display name per user
    c_id = models.CharField(max_length=255, unique=True)  # UUID + collection name

    class Meta:
        unique_together = ('user', 'c_name')   # Enforce uniqueness per user

    def __str__(self):
        return f"{self.user.username} - {self.collection_name}"
