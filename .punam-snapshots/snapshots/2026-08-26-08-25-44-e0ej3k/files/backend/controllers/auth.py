"""JWT authentication and role authorization helpers."""

from functools import wraps

from flask import jsonify
from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required

from models import User


def current_user():
    """Return the authenticated user, or ``None`` when its token is stale."""
    identity = current_user_id()
    return User.query.get(identity) if identity is not None else None


def current_user_id():
    """Return the current JWT subject as an integer database key."""
    identity = get_jwt_identity()
    try:
        return int(identity)
    except (TypeError, ValueError):
        return None


def role_required(role):
    """Require a valid JWT whose role claim matches ``role``."""
    def decorator(view):
        @wraps(view)
        @jwt_required()
        def wrapped(*args, **kwargs):
            if get_jwt().get("role") != role:
                return jsonify(error="Forbidden"), 403
            return view(*args, **kwargs)

        return wrapped

    return decorator


def owner_or_admin(user_id):
    """Return whether the authenticated user owns a record or is an admin."""
    return get_jwt().get("role") == "admin" or current_user_id() == user_id