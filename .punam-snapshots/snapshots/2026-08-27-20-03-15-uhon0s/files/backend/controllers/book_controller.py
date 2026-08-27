"""Catalogue CRUD routes."""

from decimal import Decimal, InvalidOperation

from flask import Blueprint, request
from marshmallow import ValidationError

from models import Book, Lending, Order, db
from schemas import book_schema, books_schema

from .auth import role_required
from .responses import error, json_payload, rollback_error, success, validation_error

book_bp = Blueprint("books", __name__)


@book_bp.get("/books")
def list_books():
	"""Search the catalogue and return a paginated result set."""
	query = Book.query
	for field in ("title", "author"):
		value = request.args.get(field)
		if value:
			query = query.filter(getattr(Book, field).ilike(f"%{value}%"))
	try:
		for argument, operator in (("min_price", ">="), ("max_price", "<=")):
			value = request.args.get(argument)
			if value is not None:
				price = Decimal(value)
				query = query.filter(Book.price >= price) if operator == ">=" else query.filter(Book.price <= price)
		page = int(request.args.get("page", 1))
		per_page = int(request.args.get("per_page", 20))
		if page < 1 or not 1 <= per_page <= 100:
			raise ValueError
	except (InvalidOperation, ValueError):
		return error("Invalid price or pagination parameter", 400)
	result = query.order_by(Book.id).paginate(page=page, per_page=per_page, error_out=False)
	return success({"items": books_schema.dump(result.items), "page": page, "per_page": per_page, "total": result.total}, "Books retrieved")


@book_bp.get("/books/<int:book_id>")
def get_book(book_id):
	book = db.session.get(Book, book_id)
	return error("Book not found", 404) if book is None else success(book_schema.dump(book), "Book retrieved")


@book_bp.post("/books")
@role_required("admin")
def create_book():
	payload, failure = json_payload()
	if failure:
		return failure
	try:
		book = book_schema.load(payload)
		db.session.add(book)
		db.session.commit()
		return success(book_schema.dump(book), "Book created", 201)
	except ValidationError as exception:
		return validation_error(exception)
	except Exception as exception:
		return rollback_error(exception)


@book_bp.put("/books/<int:book_id>")
@role_required("admin")
def update_book(book_id):
	book = db.session.get(Book, book_id)
	if book is None:
		return error("Book not found", 404)
	payload, failure = json_payload()
	if failure:
		return failure
	try:
		changes = book_schema.load(payload, partial=True)
		for field in ("title", "author", "price", "stock_quantity", "description", "cover_image"):
			value = getattr(changes, field, None)
			if value is not None:
				setattr(book, field, value)
		db.session.commit()
		return success(book_schema.dump(book), "Book updated")
	except ValidationError as exception:
		return validation_error(exception)
	except Exception as exception:
		return rollback_error(exception)


@book_bp.delete("/books/<int:book_id>")
@role_required("admin")
def delete_book(book_id):
	book = db.session.get(Book, book_id)
	if book is None:
		return error("Book not found", 404)
	active_order = Order.query.filter(Order.book_id == book_id, Order.status.in_(["pending", "approved"])).first()
	active_lending = Lending.query.filter(Lending.book_id == book_id, Lending.status.in_(["requested", "approved"])).first()
	if active_order or active_lending:
		return error("Book has active orders or lendings", 409)
	try:
		db.session.delete(book)
		db.session.commit()
		return "", 204
	except Exception as exception:
		return rollback_error(exception)
