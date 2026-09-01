"""Shopping and lending cart item model."""

from datetime import datetime, timezone

from .db import db


class Cart(db.Model):
    """Represents a book a user has queued for purchase or lending."""

    __tablename__ = "cart_items"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    book_id = db.Column(db.Integer, db.ForeignKey("books.id"), nullable=False, index=True)
    cart_type = db.Column(db.String(20), nullable=False, default="purchase")
    quantity = db.Column(db.Integer, nullable=False, default=1)
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    user = db.relationship("User", back_populates="cart_items")
    book = db.relationship("Book", back_populates="cart_items")

    __table_args__ = (db.UniqueConstraint("user_id", "book_id", "cart_type", name="uq_cart_item"),)

    def __repr__(self):
        return f"<Cart id={self.id} type={self.cart_type!r} quantity={self.quantity}>"