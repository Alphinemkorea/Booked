"""Serialization and validation for catalogue books."""

from marshmallow import fields, validate

from models.book import Book

from .error_messages import PRICE_NON_NEGATIVE, REQUIRED, STOCK_NON_NEGATIVE
from .extensions import ma


class BookSchema(ma.SQLAlchemyAutoSchema):
    """Serializes books without relationship collections to prevent recursion."""

    title = fields.String(required=True, error_messages={"required": REQUIRED})
    author = fields.String(required=True, error_messages={"required": REQUIRED})
    price = fields.Decimal(required=True, as_string=True, validate=validate.Range(min=0, error=PRICE_NON_NEGATIVE))
    stock_quantity = fields.Integer(
        required=False,
        load_default=0,
        validate=validate.Range(min=0, error=STOCK_NON_NEGATIVE),
    )

    class Meta:
        model = Book
        load_instance = True
        include_fk = True
        include_relationships = False


book_schema = BookSchema()
books_schema = BookSchema(many=True)