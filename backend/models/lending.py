"""Library lending model."""

from datetime import datetime, timezone

from .db import db


class Lending(db.Model):
	"""Represents a user's request to borrow a book from the library."""

	__tablename__ = "lendings"

	id = db.Column(db.Integer, primary_key=True)
	user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
	book_id = db.Column(db.Integer, db.ForeignKey("books.id"), nullable=False, index=True)
	status = db.Column(db.String(20), nullable=False, default="requested")
	due_date = db.Column(db.DateTime(timezone=True), nullable=True)
	created_at = db.Column(db.DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc))
	updated_at = db.Column(
		db.DateTime(timezone=True),
		nullable=False,
		default=lambda: datetime.now(timezone.utc),
		onupdate=lambda: datetime.now(timezone.utc),
	)

	user = db.relationship("User", back_populates="lendings")
	book = db.relationship("Book", back_populates="lendings")

	def __repr__(self):
		return f"<Lending id={self.id} status={self.status!r}>"
