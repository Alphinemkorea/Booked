"""Shared Flask-Marshmallow extension."""

from flask_marshmallow import Marshmallow
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema


class BookedMarshmallow(Marshmallow):
	SQLAlchemyAutoSchema = SQLAlchemyAutoSchema


ma = BookedMarshmallow()