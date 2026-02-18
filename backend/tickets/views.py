from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Ticket
from .serializers import TicketSerializer


class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all().order_by('-created_at')
    serializer_class = TicketSerializer

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
    ]

    filterset_fields = ['category', 'priority', 'status']
    search_fields = ['title', 'description']
