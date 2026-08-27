"""User account model."""

from datetime import datetime, timezone

from .db import db


class User(db.Model):
	"""Represents an authenticated customer or administrator account."""

	__tablename__ = "users"

	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(120), nullable=False)
	email = db.Column(db.String(255), unique=True, nullable=False, index=True)
	password_hash = db.Column(db.String(255), nullable=False)
	role = db.Column(db.String(20), nullable=False, default="user")
	created_at = db.Column(db.DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc))
	updated_at = db.Column(
		db.DateTime(timezone=True),
		nullable=False,
		default=lambda: datetime.now(timezone.utc),
		onupdate=lambda: datetime.now(timezone.utc),
	)

	orders = db.relationship("Order", back_populates="user", cascade="all, delete-orphan")
	lendings = db.relationship("Lending", back_populates="user", cascade="all, delete-orphan")
	cart_items = db.relationship("Cart", back_populates="user", cascade="all, delete-orphan")

	def __repr__(self):
		return f"<User id={self.id} email={self.email!r}>"
