from django.db import models
from django.contrib.auth.models import User


class Todo(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    completed = models.BooleanField(default=False)
    PRIORITY_CHOICES = (
        (0, 'Low'),
        (1, 'Medium'),
        (2, 'High'),
    )
    priority = models.CharField(
        max_length=1,
        choices=PRIORITY_CHOICES,
        default=1,
    )
    todo_list = models.ForeignKey(
        'TodoList',
        on_delete=models.SET_NULL,
        null=True,
    )

    def __str__(self):
        return self.title


class TodoList(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return self.title
