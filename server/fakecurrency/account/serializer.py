from rest_framework import serializers
from .models import *



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=['username','first_name','location','password','email']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
    
class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model=LocationModel
        fields='__all__'
    
class UserViewSerializer(serializers.ModelSerializer):
    location=LocationSerializer()
    class Meta:
        model=User
        fields=['id','username','first_name','location','email','control_room','is_superuser']




class FeedbackSerializer(serializers.ModelSerializer):
    user=UserViewSerializer(read_only=True)
    class Meta:
        model=FeedbackModel
        fields = ['id', 'feedback', 'rating', 'date','user'] 

class ResultSerializer(serializers.ModelSerializer):
    class Meta:
        model=CurrencyResultModel
        fields='__all__'


class Emailser(serializers.Serializer):
    email=models.PositiveIntegerField()


class ChatSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)
    receiver_username = serializers.CharField(source='receiver.username', read_only=True)

    class Meta:
        model = ChatModel
        fields = ['id', 'sender', 'receiver', 'sender_username', 'receiver_username', 'message', 'timestamp', 'status']
        read_only_fields = ['id', 'timestamp', 'status']