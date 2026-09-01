"""Library lending routes with safe status transitions."""

from flask import Blueprint
from flask_jwt_extended import get_jwt, jwt_required
from marshmallow import ValidationError

from models import Book, Lending, User, db
from schemas import lending_schema, lendings_schema

from .auth import current_user_id, owner_or_admin, role_required
from .responses import error, json_payload, rollback_error, success, validation_error

lending_bp = Blueprint("lendings", __name__)


@lending_bp.post("/lendings")
@jwt_required()
def create_lending():
	payload, failure = json_payload()
	if failure:
		return failure
	user_id = current_user_id()
	if payload.get("user_id") not in (None, user_id):
		return error("Forbidden", 403)
	payload["user_id"] = user_id
	try:
		lending = lending_schema.load(payload)
	except ValidationError as exception:
		return validation_error(exception)
	user, book = db.session.get(User, user_id), db.session.get(Book, lending.book_id)
	if user is None or book is None:
		return error("User or book not found", 404)
	if book.stock_quantity < 1:
		return error("Book is unavailable", 409)
	try:
		db.session.add(lending)
		db.session.commit()
		return success(lending_schema.dump(lending), "Lending requested", 201)
	except Exception as exception:
		return rollback_error(exception)


@lending_bp.get("/lendings")
@jwt_required()
def list_lendings():
	query = Lending.query.order_by(Lending.id)
	if get_jwt().get("role") != "admin":
		query = query.filter_by(user_id=current_user_id())
	return success(lendings_schema.dump(query.all()), "Lendings retrieved")


@lending_bp.get("/lendings/<int:lending_id>")
@jwt_required()
def get_lending(lending_id):
	lending = db.session.get(Lending, lending_id)
	if lending is None:
		return error("Lending not found", 404)
	if not owner_or_admin(lending.user_id):
		return error("Forbidden", 403)
	return success(lending_schema.dump(lending), "Lending retrieved")


def change_lending_status(lending_id, status):
	lending = db.session.get(Lending, lending_id)
	if lending is None:
		return error("Lending not found", 404)
	if lending.status != "requested":
		return error("Only requested lendings can be approved or rejected", 409)
	book = db.session.get(Book, lending.book_id)
	if status == "approved":
		if book is None or book.stock_quantity < 1:
			return error("Book is unavailable", 409)
		book.stock_quantity -= 1
	try:
		lending.status = status
		db.session.commit()
		return success(lending_schema.dump(lending), f"Lending {status}")
	except Exception as exception:
		return rollback_error(exception)


@lending_bp.put("/lendings/<int:lending_id>/approve")
@role_required("admin")
def approve_lending(lending_id):
	return change_lending_status(lending_id, "approved")


@lending_bp.put("/lendings/<int:lending_id>/reject")
@role_required("admin")
def reject_lending(lending_id):
	return change_lending_status(lending_id, "rejected")


@lending_bp.put("/lendings/<int:lending_id>/return")
@jwt_required()
def return_lending(lending_id):
	lending = db.session.get(Lending, lending_id)
	if lending is None:
		return error("Lending not found", 404)
	if not owner_or_admin(lending.user_id):
		return error("Forbidden", 403)
	if lending.status != "approved":
		return error("Only approved lendings can be returned", 409)
	try:
		book = db.session.get(Book, lending.book_id)
		if book is None:
			return error("Book not found", 404)
		book.stock_quantity += 1
		lending.status = "returned"
		db.session.commit()
		return success(lending_schema.dump(lending), "Book returned")
	except Exception as exception:
		return rollback_error(exception)
