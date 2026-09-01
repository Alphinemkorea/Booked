"""Blueprint registration for Booked API resources."""

from .book_controller import book_bp
from .cart_controller import cart_bp
from .lending_controller import lending_bp
from .order_controller import order_bp
from .user_controller import user_bp


def register_blueprints(app):
	"""Attach every version-one API resource blueprint to an application."""
	for blueprint in (user_bp, book_bp, order_bp, lending_bp, cart_bp):
		app.register_blueprint(blueprint, url_prefix="/api")


__all__ = ["register_blueprints"]
