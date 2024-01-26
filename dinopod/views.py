# views.py

from django.http import JsonResponse
from .models import Comment
from django.utils import timezone
import json
from django.views.decorators.csrf import csrf_exempt
from django.db import IntegrityError
from django.db.models import Max

@csrf_exempt 
def edit_comment(request, comment_id):
    if request.method == 'POST':
        try:
            comment = Comment.objects.get(pk=comment_id)
            data = json.loads(request.body)
            new_text = data.get('text')
            #img_url = data.get('image')
            if new_text:
                comment.text = new_text
                comment.save()
                return JsonResponse({'message': 'Comment updated successfully'})
            else:
                return JsonResponse({'error': 'New text cannot be empty'}, status=400)
        except Comment.DoesNotExist:
            return JsonResponse({'error': 'Comment not found'}, status=404)

@csrf_exempt 
def add_comment(request):
    if request.method == 'POST':
        admin_user = "Admin" 
        data = json.loads(request.body)
        new_text = data.get('text')
        img_url = data.get('image')
        if new_text:
            last_comment = Comment.objects.aggregate(max_id=Max('id'))
            new_id = last_comment['max_id'] + 1 if last_comment['max_id'] is not None else 1
            new_comment = Comment(id=new_id,author=admin_user, text=new_text, date=timezone.now(), image=img_url)

            try:
                new_comment.save()
                return JsonResponse({'message': 'Comment added successfully'})
            except IntegrityError as e:
                # Handle database constraint violation or other save-related errors
                return JsonResponse({'error': f'Failed to add comment: {str(e)}'}, status=400)
            return JsonResponse({'error': 'Text cannot be empty'}, status=400)

@csrf_exempt 
def delete_comment(request, comment_id):
    if request.method == 'DELETE':
        try:
            comment = Comment.objects.get(pk=comment_id)
            comment.delete()
            return JsonResponse({'message': 'Comment deleted successfully'})
        except Comment.DoesNotExist:
            return JsonResponse({'error': 'Comment not found'}, status=404)

def list_comments(request):
    if request.method == 'GET':
        comments = Comment.objects.all().values()  # Fetch all comments
        return JsonResponse({'comments': list(comments)})

