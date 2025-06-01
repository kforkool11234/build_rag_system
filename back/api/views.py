from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from rest_framework import status
from django.contrib.auth.models import User
from django.http import JsonResponse
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from .serializer import UserSerializer
from .serializer import CollectionSerializer
from ragged.App import s_vec
from ragged.models import UserCollection
from .serializer import CollectionSerializer
from .serializer import CommunicationSerializer
from ragged.search import semantic_search
from ragged.models import Communication
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
    print(query)
    print(request.user)
    c_name = request.data.get('c_name')
    api=request.data.get('api')
    print(c_name)
    print(api)
    if not query:
        return Response({'error': 'No query found'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        collection = UserCollection.objects.get(user=request.user,c_name=c_name)
        
    except UserCollection.DoesNotExist:
        return Response({'error': 'Collection not found for this user.'}, status=status.HTTP_404_NOT_FOUND)
    if request.data.get('role'):
        role=request.data.get('role')
        result=semantic_search(query,collection.c_id,api,role)
    else:
        result=semantic_search(query,collection.c_id,api)
    return Response({'result':result}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_collection(request):
    user_id=request.user
    print(user_id)
    collections = UserCollection.objects.filter(user_id=user_id).values('c_id', 'c_name')
    return JsonResponse(list(collections), safe=False)

@api_view(['GET', 'POST']) # Now accepts both GET and POST requests
@permission_classes([IsAuthenticated])
def chat(request):
    """
    API view to list existing Communication instances (GET) or
    create a new Communication instance (POST).

    GET Request:
    - Requires authentication (IsAuthenticated permission).
    - Returns a list of all Communication instances.
    - Supports filtering by query parameters:
        - `user_id`: Filter communications where the 'user' (recipient) matches the given user ID.
        - `c_name`: Filter communications where the 'c_name' matches the given string.

    POST Request:
    - Requires authentication (IsAuthenticated permission).
    - Expects 'c_name', 'sender', and 'message' in the request body (JSON).
    - The 'user' field (recipient) is automatically populated with the
      authenticated user making the request, via the serializer's context.
    """
    if request.method == 'GET':
        # Start with all communication objects
        communications = Communication.objects.all()

        # Get query parameters for filtering
        c_name = request.query_params.get('c_name') 

        # Apply filters if parameters are provided
        if c_name:
            # Filter by the 'user' ForeignKey's ID
            # Ensure user_id is an integer if it's coming from a URL parameter
            try:
                communications = communications.filter(user=request.user,c_name=c_name)
            except ValueError:
                return Response(
                    {"detail": "Invalid user_id. Must be an integer."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        if c_name:
            # Filter by c_name (case-sensitive exact match)
            communications = communications.filter(c_name=c_name)
            # For case-insensitive search, use c_name__iexact=c_name
            # For partial search, use c_name__icontains=c_name

        # Serialize the filtered queryset. 'many=True' is used because we are serializing a list of objects.
        serializer = CommunicationSerializer(communications, many=True)
        # Return the serialized data with a 200 OK status.
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        # Pass request.data to the serializer for deserialization and validation.
        # Crucially, pass context={'request': request} so that CurrentUserDefault
        # in the serializer can access request.user.
        serializer = CommunicationSerializer(data=request.data, context={'request': request})

        if serializer.is_valid():
            # Save the communication instance. The 'user' (recipient) is set by the serializer.
            serializer.save()
            # Return the serialized data of the newly created object with a 201 Created status.
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        # If the data is not valid, return the serializer errors with a 400 Bad Request status.
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

