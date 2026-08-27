"""Serialization and validation for purchase and lending cart items."""

from marshmallow import fields, validate

from models.cart import Cart

from .book_schema import BookSchema
from .error_messages import INVALID_CART_TYPE, QUANTITY_MINIMUM, REQUIRED
from .extensions import ma
from .user_schema import UserSchema


class CartSchema(ma.SQLAlchemyAutoSchema):
    """Serializes cart items with dump-only user and book summaries."""

    user_id = fields.Integer(required=True, error_messages={"required": REQUIRED})
    book_id = fields.Integer(required=True, error_messages={"required": REQUIRED})
    cart_type = fields.String(
        required=False,
        load_default="purchase",
        validate=validate.OneOf(["purchase", "lending"], error=INVALID_CART_TYPE),
    )
    quantity = fields.Integer(required=False, load_default=1, validate=validate.Range(min=1, error=QUANTITY_MINIMUM))
    user = fields.Nested(UserSchema(only=("id", "name", "email", "role")), dump_only=True)
    book = fields.Nested(BookSchema(only=("id", "title", "author", "price", "cover_image")), dump_only=True)

    class Meta:
        model = Cart
        load_instance = True
        include_fk = True
        include_relationships = False


cart_schema = CartSchema()
carts_schema = CartSchema(many=True)