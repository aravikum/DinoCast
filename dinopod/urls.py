from django.urls import path
from . import views

from django.contrib.auth.views import LoginView, LogoutView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('comments/test/<int:comment_id>/', views.test_endpoint, name='test_endpoint'),
    path('comments/like/<int:comment_id>/', views.like_comment, name='like_comment'),
    path('comments/add/', views.add_comment, name='add_comment'),
    path('comments/<int:comment_id>/edit/', views.edit_comment, name='edit_comment'),
    path('comments/<int:comment_id>/delete/', views.delete_comment, name='delete_comment'),
    path('comments/', views.list_comments, name='list_comments'),
]
