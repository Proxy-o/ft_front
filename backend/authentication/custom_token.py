from rest_framework_simplejwt.tokens import BlacklistMixin, AccessToken as Token

class AccessToken(BlacklistMixin, Token):
    """
        allow the use of only the access token
        with BlacklistMixin functionality
    """
    
    