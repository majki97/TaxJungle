from rest_framework import serializers
from apps.comment.models import Comment
from apps.user.serializer import UserSerializer


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = '__all__'
