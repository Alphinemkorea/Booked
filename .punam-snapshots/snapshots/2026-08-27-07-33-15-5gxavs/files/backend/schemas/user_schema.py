"""Serialization and validation for user accounts.

``password_hash`` is load-only so it can never be emitted in API responses.
"""

from marshmallow import fields, validate

from models.user import User

from .error_messages import INVALID_EMAIL, INVALID_ROLE, REQUIRED
from .extensions import ma


class UserSchema(ma.SQLAlchemyAutoSchema):
    """Serializes user account details while protecting authentication data."""

    email = fields.Email(required=True, error_messages={"required": REQUIRED, "invalid": INVALID_EMAIL})
    password_hash = fields.String(required=True, load_only=True, error_messages={"required": REQUIRED})
    role = fields.String(
        required=False,
        load_default="user",
        validate=validate.OneOf(["admin", "user"], error=INVALID_ROLE),
    )

    class Meta:
        model = User
        load_instance = True
        include_fk = True
        include_relationships = False


user_schema = UserSchema()
users_schema = UserSchema(many=True)