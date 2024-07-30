from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _


# not start or end with spaces validator
class NoSpacesValidator:
    def validate(self, password, user=None):
        if password[0] == " " or password[-1] == " ":
            raise ValidationError(
                _("Password can't start or end with spaces"),
                code='password_no_spaces',
            )

    def get_help_text(self):
        return _("Password can't start or end with spaces")