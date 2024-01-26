from django.db import models


class Comment(models.Model):
    id = models.IntegerField(primary_key=True)
    author = models.CharField(max_length=50)
    text = models.TextField()
    date = models.DateTimeField()
    likes = models.IntegerField(default=0)
    image = models.URLField(blank=True)

    def __str__(self):
        return f"Comment by {self.author} on {self.date}"
