from django.urls import path
from . import views

urlpatterns = [
    path('comments/', views.list_comments, name='list_comments'),
    path('comments/add/', views.add_comment, name='add_comment'),
    path('comments/<int:comment_id>/edit/', views.edit_comment, name='edit_comment'),
    path('comments/<int:comment_id>/delete/', views.delete_comment, name='delete_comment'),
]