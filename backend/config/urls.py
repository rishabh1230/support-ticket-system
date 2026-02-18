from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from tickets.views import TicketViewSet

router = DefaultRouter()
router.register(r'tickets', TicketViewSet, basename='ticket')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
