"""Authenticated cart management and atomic checkout routes."""

from flask import Blueprint
from flask_jwt_extended import jwt_required
from marshmallow import ValidationError

from models import Book, Cart, Lending, Order, db
from schemas import cart_schema, carts_schema, lending_schema, orders_schema

from .auth import current_user_id, owner_or_admin
from .responses import error, json_payload, rollback_error, success, validation_error

cart_bp = Blueprint("cart", __name__)


@cart_bp.post("/cart")
@jwt_required()
def add_cart_item():
    payload, failure = json_payload()
    if failure:
        return failure
    user_id = current_user_id()
    if payload.get("user_id") not in (None, user_id):
        return error("Forbidden", 403)
    payload["user_id"] = user_id
    try:
        item = cart_schema.load(payload)
    except ValidationError as exception:
        return validation_error(exception)
    if db.session.get(Book, item.book_id) is None:
        return error("Book not found", 404)
    existing = Cart.query.filter_by(user_id=user_id, book_id=item.book_id, cart_type=item.cart_type).first()
    try:
        if existing:
            existing.quantity += item.quantity
            item = existing
        else:
            db.session.add(item)
        db.session.commit()
        return success(cart_schema.dump(item), "Cart updated", 201)
    except Exception as exception:
        return rollback_error(exception)


@cart_bp.get("/cart")
@jwt_required()
def list_cart():
    items = Cart.query.filter_by(user_id=current_user_id()).order_by(Cart.id).all()
    return success(carts_schema.dump(items), "Cart retrieved")


@cart_bp.put("/cart/<int:cart_id>")
@jwt_required()
def update_cart_item(cart_id):
    item = db.session.get(Cart, cart_id)
    if item is None:
        return error("Cart item not found", 404)
    if not owner_or_admin(item.user_id):
        return error("Forbidden", 403)
    payload, failure = json_payload()
    if failure:
        return failure
    payload.update({"user_id": item.user_id, "book_id": item.book_id, "cart_type": item.cart_type})
    try:
        changes = cart_schema.load(payload)
        item.quantity = changes.quantity
        db.session.commit()
        return success(cart_schema.dump(item), "Cart item updated")
    except ValidationError as exception:
        return validation_error(exception)
    except Exception as exception:
        return rollback_error(exception)


@cart_bp.delete("/cart/<int:cart_id>")
@jwt_required()
def delete_cart_item(cart_id):
    item = db.session.get(Cart, cart_id)
    if item is None:
        return error("Cart item not found", 404)
    if not owner_or_admin(item.user_id):
        return error("Forbidden", 403)
    try:
        db.session.delete(item)
        db.session.commit()
        return "", 204
    except Exception as exception:
        return rollback_error(exception)


@cart_bp.post("/cart/checkout")
@jwt_required()
def checkout():
    user_id = current_user_id()
    items = Cart.query.filter_by(user_id=user_id).all()
    if not items:
        return error("Cart is empty", 400)
    books = {item.book_id: db.session.get(Book, item.book_id) for item in items}
    if any(book is None for book in books.values()):
        return error("A cart book no longer exists", 409)
    purchase_quantities = {}
    for item in items:
        if item.cart_type == "purchase":
            purchase_quantities[item.book_id] = purchase_quantities.get(item.book_id, 0) + item.quantity
    if any(books[book_id].stock_quantity < quantity for book_id, quantity in purchase_quantities.items()):
        return error("Insufficient stock", 409)
    try:
        orders, lendings = [], []
        for item in items:
            book = books[item.book_id]
            if item.cart_type == "purchase":
                book.stock_quantity -= item.quantity
                order = Order(user_id=user_id, book_id=book.id, quantity=item.quantity, total_price=book.price * item.quantity)
                db.session.add(order)
                orders.append(order)
            else:
                if book.stock_quantity < 1:
                    return error("Book is unavailable", 409)
                lending = Lending(user_id=user_id, book_id=book.id)
                db.session.add(lending)
                lendings.append(lending)
            db.session.delete(item)
        db.session.commit()
        return success({"orders": orders_schema.dump(orders), "lendings": lending_schema.dump(lendings, many=True)}, "Checkout completed", 201)
    except Exception as exception:
        return rollback_error(exception)