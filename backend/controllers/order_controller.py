"""Purchase order routes with server-enforced ownership and stock control."""

from flask import Blueprint
from flask_jwt_extended import get_jwt, jwt_required
from marshmallow import ValidationError

from models import Book, Order, User, db
from schemas import order_schema, orders_schema

from .auth import current_user_id, owner_or_admin, role_required
from .responses import error, json_payload, rollback_error, success, validation_error

order_bp = Blueprint("orders", __name__)


@order_bp.post("/orders")
@jwt_required()
def create_order():
	payload, failure = json_payload()
	if failure:
		return failure
	user_id = current_user_id()
	if payload.get("user_id") not in (None, user_id):
		return error("Forbidden", 403)
	payload["user_id"] = user_id
	payload["total_price"] = 0
	try:
		order = order_schema.load(payload)
	except ValidationError as exception:
		return validation_error(exception)
	user, book = db.session.get(User, user_id), db.session.get(Book, order.book_id)
	if user is None or book is None:
		return error("User or book not found", 404)
	if book.stock_quantity < order.quantity:
		return error("Insufficient stock", 409)
	try:
		book.stock_quantity -= order.quantity
		order.total_price = book.price * order.quantity
		db.session.add(order)
		db.session.commit()
		return success(order_schema.dump(order), "Order created", 201)
	except Exception as exception:
		return rollback_error(exception)


@order_bp.get("/orders")
@jwt_required()
def list_orders():
	query = Order.query.order_by(Order.id)
	if get_jwt().get("role") != "admin":
		query = query.filter_by(user_id=current_user_id())
	return success(orders_schema.dump(query.all()), "Orders retrieved")


@order_bp.get("/orders/<int:order_id>")
@jwt_required()
def get_order(order_id):
	order = db.session.get(Order, order_id)
	if order is None:
		return error("Order not found", 404)
	if not owner_or_admin(order.user_id):
		return error("Forbidden", 403)
	return success(order_schema.dump(order), "Order retrieved")


def update_order_status(order_id, status):
	order = db.session.get(Order, order_id)
	if order is None:
		return error("Order not found", 404)
	if order.status != "pending":
		return error("Only pending orders can be updated", 409)
	try:
		if status == "rejected":
			book = db.session.get(Book, order.book_id)
			if book is None:
				return error("Book not found", 404)
			book.stock_quantity += order.quantity
		order.status = status
		db.session.commit()
		return success(order_schema.dump(order), f"Order {status}")
	except Exception as exception:
		return rollback_error(exception)


@order_bp.put("/orders/<int:order_id>/approve")
@role_required("admin")
def approve_order(order_id):
	return update_order_status(order_id, "approved")


@order_bp.put("/orders/<int:order_id>/reject")
@role_required("admin")
def reject_order(order_id):
	return update_order_status(order_id, "rejected")
