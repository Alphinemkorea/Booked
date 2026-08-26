"""Serialization and validation for book purchase orders."""

from marshmallow import fields, validate

from models.order import Order

from .book_schema import BookSchema
from .error_messages import INVALID_ORDER_STATUS, PRICE_NON_NEGATIVE, QUANTITY_MINIMUM, REQUIRED
from .extensions import ma
from .user_schema import UserSchema


class OrderSchema(ma.SQLAlchemyAutoSchema):
    """Serializes orders with compact, dump-only user and book summaries."""

    user_id = fields.Integer(required=True, error_messages={"required": REQUIRED})
    book_id = fields.Integer(required=True, error_messages={"required": REQUIRED})
    quantity = fields.Integer(required=True, validate=validate.Range(min=1, error=QUANTITY_MINIMUM))
    status = fields.String(
        required=False,
        load_default="pending",
        validate=validate.OneOf(["pending", "approved", "rejected", "completed"], error=INVALID_ORDER_STATUS),
    )
    total_price = fields.Decimal(required=True, as_string=True, validate=validate.Range(min=0, error=PRICE_NON_NEGATIVE))
    user = fields.Nested(UserSchema(only=("id", "name", "email", "role")), dump_only=True)
    book = fields.Nested(BookSchema(only=("id", "title", "author", "price", "cover_image")), dump_only=True)

    class Meta:
        model = Order
        load_instance = True
        include_fk = True
        include_relationships = False


order_schema = OrderSchema()
orders_schema = OrderSchema(many=True)