from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to allow only owners of an object to edit it.
    """

    def has_object_permission(self, request, view, obj):
        # check if the access is in the cookie
        # Allow read-only requests for any user
        if request.method in permissions.SAFE_METHODS:
            return True

        # Check if the user is the owner of the object
        return obj == request.user  # Assuming the user attribute on obj represents the owner


class IsOwner(permissions.BasePermission):
    """
    Custom permission to allow only owners of an object to edit it.
    """

    def has_object_permission(self, request, view, obj):

        # Check if the user is the owner of the object
        return obj == request.user  # Assuming the user attribute on obj represents the owner
