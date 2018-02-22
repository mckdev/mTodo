from rest_framework import filters, viewsets

from .models import Todo, TodoList
from .serializers import TodoSerializer, TodoListSerializer


class TodoViewSet(viewsets.ModelViewSet):
    queryset = Todo.objects.all().order_by('-id')
    serializer_class = TodoSerializer
    filter_backends = (filters.SearchFilter,)
    search_fields = (
        'id',
        'title',
        'completed',
        'priority',
        'todo_list__id',
    )

    def get_queryset(self):
        queryset = Todo.objects.filter(user=self.request.user)

        todo_list = self.request.query_params.get('todo_list', None)
        if todo_list is not None:
            queryset = queryset.filter(todo_list__id=todo_list)

        inbox = self.request.query_params.get('inbox', None)

        if inbox is not None:
            queryset = queryset.filter(todo_list__id__isnull=True)

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TodoListViewSet(viewsets.ModelViewSet):
    queryset = TodoList.objects.all().order_by('-id')
    serializer_class = TodoListSerializer

    def get_queryset(self):
        queryset = TodoList.objects.all().filter(
            user=self.request.user)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
