from rest_framework import serializers
from django.contrib.auth.models import User
from vectorise.models import UserCollection
import uuid
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'password']

    def create(self, validated_data):
        user = User(
            username=validated_data['username']
        )
        user.set_password(validated_data['password'])  # Hash password
        user.save()
        return user
class CollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCollection
        fields = ['id', 'user', 'c_name', 'c_id']
        extra_kwargs = {
            'user': {'read_only': True},
            'c_id': {'read_only': True},  # Prevent client from sending this manually
        }

    def create(self, validated_data):
        user = self.context['request'].user
        c_name = validated_data['c_name']
        unique_id = f"{uuid.uuid4()}_{c_name}"
        return UserCollection.objects.create(user=user, c_name=c_name, c_id=unique_id)