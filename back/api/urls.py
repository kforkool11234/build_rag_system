from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainSlidingView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
urlpatterns=[
    path("api/token/", TokenObtainSlidingView.as_view(), name="token_obtain_sliding"),
    path('register/', views.register_user, name='register_user'),
    path('create-collection/', views.create_collection, name='create_collection'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('upload/', views.vectorise, name='vectorise'),
    path('search/', views.search, name='search'),
    path('collection/', views.get_collection, name='collection'),
    path('chat/',views.chat,name="chat")
]