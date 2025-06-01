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
class Communication(models.Model):
    """
    A Django model to store collection entries with updated sender and recipient fields.

    Fields:
    - c_name: A character field for the collection's name or subject.
    - sender: A character field for the name of the sender (can be any string, not necessarily a registered user).
    - recipient_user: A foreign key to Django's built-in User model, representing the recipient user.
                      When the User object is deleted, all associated collection objects
                      will also be deleted (CASCADE). This field can be null if no specific
                      registered user is the recipient.
    - message: A text field for the content of the collection.
    - timestamp: A DateTimeField that automatically records the creation time.
    """
    c_name = models.CharField(max_length=255, )
    sender = models.CharField(max_length=255, )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE, # Deletes collections if the recipient user is deleted
        related_name='received_collections', # Allows reverse access from User to collection
    )
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True, )

    class Meta:
        """
        Meta options for the collection model.
        """
        verbose_name = "collection"
        verbose_name_plural = "collections"
        ordering = ['timestamp'] # Order collections by timestamp in descending order

    def __str__(self):
        """
        String representation of the collection object.
        """
        recipient_info = self.recipient_user.username if self.recipient_user else "No specific user"
        return f"'{self.c_name}' from '{self.sender}' to '{recipient_info}' at {self.timestamp.strftime('%Y-%m-%d %H:%M')}"

