from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth import get_user_model
from authentication.serializers import UserSerializer

User = get_user_model()

class Command(BaseCommand):
    help = 'Create users using the UserSerializer'
    executed = 'executed'

    def add_arguments(self, parser):
        parser.add_argument('count', type=int, help='Specify how much user to create')

    def handle(self, *args, **kwargs):
        count = kwargs['count']
        if not count:
            raise CommandError("Count argument must be provided as positive number")
        if User.objects.all().count():
            print("Users already generated")
            return
        print("Creating users...")
        for i in range(count):
            user_info = {
                'username': f'user{i}',
                'email': f'user{i}@email.com',
                'password': f'pass@{i}',
            }
            serializer = UserSerializer(data=user_info)
            if serializer.is_valid():
                user = serializer.save()
                user.set_password(user_info['password'])
                user.s_token = User.objects.make_random_password()
                user.save()
        users = User.objects.all()
        for u in users:
            print(u.username, 'is Making friends...')
            for f in users.exclude(id=u.id):
                u.friends.add(f)
            u.save()
