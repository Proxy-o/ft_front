from django.urls import path
from . import views

urlpatterns = [
    path('invitations', views.GetInvitationsView.as_view()),
    path('sent_invitations', views.InvitationView.as_view()),
    path('send_invitation', views.InvitationView.as_view()),
    path('accept_invitation', views.AcceptInvitationView.as_view()),
    path('decline_invitation', views.DeclineInvitationView.as_view()),
    path('onGoingGame', views.OnGoingGame.as_view()),
    path('onGoingFourGame', views.OnGoingFourGame.as_view()),
    path('endGame', views.EndGame.as_view()),
    path('endGameFour', views.EndGameFour.as_view()),
    path('surrender', views.Surrender.as_view()),
    path('leaveGame', views.LeaveGame.as_view()),
    
    path('tournament/<int:tournament_id>', views.TournamentView.as_view()),
    path('OngoingTournament', views.OnGoingTournamentView.as_view()),
    path('onGoingTournamentGame/<int:tournament_id>', views.OnGoingTournamentGame.as_view()),
    path('deleteTournament', views.DeleteTournament.as_view()),
    path('createTournament', views.TournamentView.as_view()),
    path('leaveTournament', views.LeaveTournament.as_view()),
    path('abortTournament', views.AbortTournament.as_view()),
    path('accept_invitation_tournament', views.AcceptInvitationTournament.as_view()),
    path('start_tournament', views.StartTournament.as_view()),
    # games for a user with a given id
    path('user/<int:user_id>', views.UserGames.as_view()),
    path('twovtwo/user/<int:user_id>', views.TwoVTwoGameView.as_view()),
    path('tournaments/user/<int:user_id>', views.TournamentsView.as_view()),
    path('states/<int:user_id>', views.GamesStates.as_view()),
]
