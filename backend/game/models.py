from django.db import models
from django.contrib.auth import get_user_model
User = get_user_model()
class Game(models.Model):
    user1 = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name='user1', blank=True, null=True)
    user2 = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name='user2', blank=True, null=True)
    user3 = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name='user3', blank=True, null=True)
    user4 = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name='user4', blank=True, null=True)
    user1_score = models.IntegerField(default=0)
    user2_score = models.IntegerField(default=0)
    winner = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name='winner', blank=True, null=True)
    type = models.CharField(max_length=10, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    
class Tournament(models.Model):
    creator = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name='created_tournament')
    user1 = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name='user1_tournament', blank=True, null=True)
    user1_left = models.BooleanField(default=False)
    user2 = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name='user2_tournament', blank=True, null=True)
    user2_left = models.BooleanField(default=False)
    user3 = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name='user3_tournament', blank=True, null=True)
    user3_left = models.BooleanField(default=False)
    user4 = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name='user4_tournament', blank=True, null=True)
    user4_left = models.BooleanField(default=False)
    started = models.BooleanField(default=False)
    semi1 = models.ForeignKey(to=Game, on_delete=models.CASCADE, related_name='semi1', blank=True, null=True)
    semi2 = models.ForeignKey(to=Game, on_delete=models.CASCADE, related_name='semi2', blank=True, null=True)
    final = models.ForeignKey(to=Game, on_delete=models.CASCADE, related_name='final', blank=True, null=True)
    winner = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name='tournament_winner', blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)



class Invitation(models.Model):
    id = models.AutoField(primary_key=True, unique=True)
    sender = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name='invitations_sent')
    receiver = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name='invitations_received')
    type = models.CharField(max_length=10, blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    is_accepted = models.BooleanField(blank=True, null=True)

