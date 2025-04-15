from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from .serializer import UserSerializer
from .serializer import CollectionSerializer
from vectorise.App import s_vec
from vectorise.models import UserCollection
from .serializer import CollectionSerializer
from vectorise.search import semantic_search
# Create your views here.

@api_view(['POST'])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()

        # Generate JWT token for the new user
        refresh = RefreshToken.for_user(user)

        return Response({
            "message": "User created successfully!",
            "refresh": str(refresh),
            "access": str(refresh.access_token)
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_collection(request):
    serializer = CollectionSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def vectorise(request):
    files=request.FILES.getlist('files')
    c_name = request.data.get('c_name')
    if not files or not c_name:
        return Response({'error': 'Files and collection name are required.'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        collection = UserCollection.objects.get(user=request.user,c_name=c_name)
    except UserCollection.DoesNotExist:
        return Response({'error': 'Collection not found for this user.'}, status=status.HTTP_404_NOT_FOUND)
    for u_file in files:
        s_vec(u_file,collection.c_id)
    return Response({'message': 'Files processed successfully'}, status=status.HTTP_200_OK)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def search(request):
    query=request.data.get('query')
    c_name = request.data.get('c_name')
    if not query:
        return Response({'error': 'No query found'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        collection = UserCollection.objects.get(user=request.user,c_name=c_name)
    except UserCollection.DoesNotExist:
        return Response({'error': 'Collection not found for this user.'}, status=status.HTTP_404_NOT_FOUND)
    result=semantic_search(query,collection.c_id)
    return Response({'result':result}, status=status.HTTP_200_OK)