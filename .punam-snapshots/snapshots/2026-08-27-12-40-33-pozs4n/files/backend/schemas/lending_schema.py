"""Serialization and validation for library lending requests."""

from marshmallow import fields, validate

from models.lending import Lending

from .book_schema import BookSchema
from .error_messages import INVALID_LENDING_STATUS, REQUIRED
from .extensions import ma
from .user_schema import UserSchema


class LendingSchema(ma.SQLAlchemyAutoSchema):
    """Serializes lending requests with compact, dump-only related records."""

    user_id = fields.Integer(required=True, error_messages={"required": REQUIRED})
    book_id = fields.Integer(required=True, error_messages={"required": REQUIRED})
    status = fields.String(
        required=False,
        load_default="requested",
        validate=validate.OneOf(["requested", "approved", "rejected", "returned"], error=INVALID_LENDING_STATUS),
    )
    user = fields.Nested(UserSchema(only=("id", "name", "email", "role")), dump_only=True)
    book = fields.Nested(BookSchema(only=("id", "title", "author", "cover_image")), dump_only=True)

    class Meta:
        model = Lending
        load_instance = True
        include_fk = True
        include_relationships = False


lending_schema = LendingSchema()
lendings_schema = LendingSchema(many=True)