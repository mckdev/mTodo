from django.conf.urls import include, url
from django.contrib import admin
from django.views.generic.base import TemplateView
from rest_framework import routers
from todos import views
from rest_framework_jwt.views import obtain_jwt_token


router = routers.DefaultRouter()
router.register(r'todos', views.TodoViewSet)
router.register(r'lists', views.TodoListViewSet)

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^api/', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^api-token-auth/', obtain_jwt_token),
    url(r'^.*', TemplateView.as_view(template_name="ang_home.html"), name="home")
]
