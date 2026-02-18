from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count
from django.db.models.functions import TruncDate

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

    @action(detail=False, methods=['get'], url_path='stats')
    def stats(self, request):
        total_tickets = Ticket.objects.count()
        open_tickets = Ticket.objects.filter(status='open').count()

        tickets_per_day = (
            Ticket.objects
            .annotate(day=TruncDate('created_at'))
            .values('day')
            .annotate(count=Count('id'))
        )

        avg_tickets_per_day = 0
        if tickets_per_day.exists():
            total_days = tickets_per_day.count()
            total_count = sum(item['count'] for item in tickets_per_day)
            avg_tickets_per_day = total_count / total_days

        priority_breakdown = (
            Ticket.objects
            .values('priority')
            .annotate(count=Count('id'))
        )

        category_breakdown = (
            Ticket.objects
            .values('category')
            .annotate(count=Count('id'))
        )

        return Response({
            "total_tickets": total_tickets,
            "open_tickets": open_tickets,
            "avg_tickets_per_day": round(avg_tickets_per_day, 2),
            "priority_breakdown": {
                item['priority']: item['count']
                for item in priority_breakdown
            },
            "category_breakdown": {
                item['category']: item['count']
                for item in category_breakdown
            }
        })
