import random
from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth import get_user_model
from authentication.serializers import UserSerializer
from friends.models import Friend_Request

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
        if not User.objects.count():
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
            print(f"{count} users created")
        print("Creating friends...")
        users = User.objects.all()
        for i in range(1, 11):
            for j in range(1, 11):
                if i is not j:
                    users.get(id=i).friends.add(users.get(id=j))
        print("Creating friend requests...")
        for i in range(11, users.count() + 1):
            for j in range(1, 11):
                Friend_Request.objects.get_or_create(
                    from_user=users.get(id=i),
                    to_user=users.get(id=j)
                )
        print("Creating random scores, wins, losses...")
        for user in users:
            user.score = random.randint(0, 1000)
            user.wins = random.randint(0, 50)
            user.losses = random.randint(0, 50)
            user.save()
        print("Done")
            
