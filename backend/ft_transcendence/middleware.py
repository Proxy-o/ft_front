class RemoveTrailingSlashMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Remove trailing slash if it is not the root URL
        if request.path != '/' and request.path.endswith('/'):
            new_path = request.path.rstrip('/')
            return self._redirect(new_path)

        response = self.get_response(request)
        return response

    def _redirect(self, new_path):
        from django.http import HttpResponsePermanentRedirect
        return HttpResponsePermanentRedirect(new_path)
