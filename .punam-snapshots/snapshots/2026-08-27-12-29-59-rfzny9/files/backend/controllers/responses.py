"""Shared consistent API response helpers."""

from flask import current_app, jsonify

from models import db


def success(data, message, status=200):
    """Return a consistent successful JSON response."""
    return jsonify(data=data, message=message), status


def error(message, status):
    """Return a consistent failure JSON response."""
    return jsonify(error=message), status


def json_payload():
    """Return a JSON object payload or a validation-shaped 400 response."""
    from flask import request

    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return None, error("Request body must be a JSON object", 400)
    return payload, None


def validation_error(exception):
    """Turn Marshmallow errors into the documented response shape."""
    return error(exception.messages, 400)


def rollback_error(exception):
    """Rollback a failed write and hide unexpected internal error details."""
    db.session.rollback()
    current_app.logger.exception("Database operation failed", exc_info=exception)
    return error("An unexpected server error occurred", 500)