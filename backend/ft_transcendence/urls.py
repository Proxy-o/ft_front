
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('authentication.urls')),
    path('api/', include('friends.urls')),
    path('api/chat/', include('chat_app.urls')),
    path('api/game/', include('game.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
