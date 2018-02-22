from rest_framework import serializers

from .models import Todo, TodoList


class TodoSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = Todo
		fields = (
			'id',
			'title',
			'completed',
			'priority',
			'todo_list',
		)		

class TodoListSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = TodoList
		fields = (
			'id',
			'title',
			'completed',
			'url',
		)
