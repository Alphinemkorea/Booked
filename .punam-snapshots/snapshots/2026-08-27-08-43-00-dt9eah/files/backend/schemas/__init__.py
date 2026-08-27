"""Expose shared Marshmallow configuration and Booked serializers."""

from .extensions import ma
from .user_schema import UserSchema, user_schema, users_schema
from .book_schema import BookSchema, book_schema, books_schema
from .order_schema import OrderSchema, order_schema, orders_schema
from .lending_schema import LendingSchema, lending_schema, lendings_schema
from .cart_schema import CartSchema, cart_schema, carts_schema

__all__ = [
	"ma",
	"UserSchema", "user_schema", "users_schema",
	"BookSchema", "book_schema", "books_schema",
	"OrderSchema", "order_schema", "orders_schema",
	"LendingSchema", "lending_schema", "lendings_schema",
	"CartSchema", "cart_schema", "carts_schema",
]
