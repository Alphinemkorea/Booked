"""Book catalogue model."""

from datetime import datetime, timezone

from .db import db


class Book(db.Model):
	"""Represents a book available for purchase or borrowing."""

	__tablename__ = "books"

	id = db.Column(db.Integer, primary_key=True)
	title = db.Column(db.String(255), nullable=False, index=True)
	author = db.Column(db.String(255), nullable=False, index=True)
	price = db.Column(db.Numeric(10, 2), nullable=False)
	stock_quantity = db.Column(db.Integer, nullable=False, default=0)
	description = db.Column(db.Text, nullable=True)
	cover_image = db.Column(db.String(500), nullable=True)
	created_at = db.Column(db.DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc))
	updated_at = db.Column(
		db.DateTime(timezone=True),
		nullable=False,
		default=lambda: datetime.now(timezone.utc),
		onupdate=lambda: datetime.now(timezone.utc),
	)

	orders = db.relationship("Order", back_populates="book")
	lendings = db.relationship("Lending", back_populates="book")
	cart_items = db.relationship("Cart", back_populates="book", cascade="all, delete-orphan")

	def __repr__(self):
		return f"<Book id={self.id} title={self.title!r}>"
