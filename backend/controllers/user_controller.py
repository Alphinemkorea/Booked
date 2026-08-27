"""Account registration, authentication, and user management routes."""

from flask import Blueprint
<<<<<<< HEAD
from flask_jwt_extended import create_access_token, get_jwt, jwt_required
=======
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
>>>>>>> upstream/feature/browse-catalogue
from marshmallow import ValidationError
from werkzeug.security import check_password_hash, generate_password_hash

from models import User, UserSettings, db
from schemas import user_schema, users_schema

from .auth import owner_or_admin, role_required
from .responses import error, json_payload, rollback_error, success, validation_error

user_bp = Blueprint("users", __name__)


@user_bp.post("/register")
def register():
<<<<<<< HEAD
	"""Create an account after validating its unique email address."""
	payload, failure = json_payload()
	if failure:
		return failure
	payload.pop("role", None)
	password = payload.pop("password", None)
	if not password:
		return error({"password": ["This field is required."]}, 400)
	if User.query.filter_by(email=payload.get("email")).first():
		return error("An account with that email already exists", 409)
	try:
		payload["password_hash"] = password
		user = user_schema.load(payload)
		user.password_hash = generate_password_hash(password)
		db.session.add(user)
		db.session.commit()
		return success(user_schema.dump(user), "User registered", 201)
	except ValidationError as exception:
		return validation_error(exception)
	except Exception as exception:
		return rollback_error(exception)
=======
    """Create an account after validating its unique email address."""
    payload, failure = json_payload()
    if failure:
        return failure
    password = payload.pop("password", None)
    if not password:
        return error({"password": ["This field is required."]}, 400)
    if User.query.filter_by(email=payload.get("email")).first():
        return error("An account with that email already exists", 409)
    try:
        payload["password_hash"] = password
        user = user_schema.load(payload)
        user.password_hash = generate_password_hash(password)
        db.session.add(user)
        db.session.commit()
        return success(user_schema.dump(user), "User registered", 201)
    except ValidationError as exception:
        return validation_error(exception)
    except Exception as exception:
        return rollback_error(exception)
>>>>>>> upstream/feature/browse-catalogue


@user_bp.post("/login")
def login():
    """Verify credentials and issue a JWT containing the user's role."""
    payload, failure = json_payload()
    if failure:
        return failure
    email, password = payload.get("email"), payload.get("password")
    if not isinstance(email, str) or not isinstance(password, str):
        return error("email and password are required", 400)
    user = User.query.filter_by(email=email).first()
    if user is None or not check_password_hash(user.password_hash, password):
        return error("Invalid email or password", 401)
    token = create_access_token(identity=str(user.id), additional_claims={"role": user.role})
    return success({"access_token": token, "user": user_schema.dump(user)}, "Login successful")


@user_bp.get("/users")
@role_required("admin")
def list_users():
    return success(users_schema.dump(User.query.order_by(User.id).all()), "Users retrieved")


@user_bp.get("/users/settings")
@jwt_required()
def get_user_settings():
    """Retrieve settings for the logged-in user, auto-creating defaults if none exist."""
    current_user_id = int(get_jwt_identity())
    settings = UserSettings.query.filter_by(user_id=current_user_id).first()

    if not settings:
        settings = UserSettings(user_id=current_user_id)
        db.session.add(settings)
        db.session.commit()

    return success(settings.to_dict(), "Settings retrieved")


@user_bp.put("/users/settings")
@jwt_required()
def update_user_settings():
    """Update settings for the logged-in user."""
    current_user_id = int(get_jwt_identity())
    settings = UserSettings.query.filter_by(user_id=current_user_id).first()

    if not settings:
        settings = UserSettings(user_id=current_user_id)
        db.session.add(settings)

    payload, failure = json_payload()
    if failure:
        return failure

    if "theme" in payload:
        settings.theme = payload["theme"]
    if "email_notifications" in payload:
        settings.email_notifications = bool(payload["email_notifications"])
    if "lending_notifications" in payload:
        settings.lending_notifications = bool(payload["lending_notifications"])

    try:
        db.session.commit()
        return success(settings.to_dict(), "Settings updated")
    except Exception as exception:
        return rollback_error(exception)


@user_bp.get("/users/<int:user_id>")
@jwt_required()
def get_user(user_id):
    if not owner_or_admin(user_id):
        return error("Forbidden", 403)
    user = db.session.get(User, user_id)
    return error("User not found", 404) if user is None else success(user_schema.dump(user), "User retrieved")


@user_bp.put("/users/<int:user_id>")
@jwt_required()
def update_user(user_id):
<<<<<<< HEAD
	if not owner_or_admin(user_id):
		return error("Forbidden", 403)
	user = db.session.get(User, user_id)
	if user is None:
		return error("User not found", 404)
	payload, failure = json_payload()
	if failure:
		return failure
	if "role" in payload and get_jwt().get("role") != "admin":
		return error("Forbidden", 403)
	password = payload.pop("password", None)
	if password is not None:
		payload["password_hash"] = password
	if "email" in payload and payload["email"] != user.email and User.query.filter_by(email=payload["email"]).first():
		return error("An account with that email already exists", 409)
	try:
		changes = user_schema.load(payload, partial=True)
		for field in ("name", "email", "role"):
			if getattr(changes, field, None) is not None:
				setattr(user, field, getattr(changes, field))
		if password is not None:
			user.password_hash = generate_password_hash(password)
		db.session.commit()
		return success(user_schema.dump(user), "User updated")
	except ValidationError as exception:
		return validation_error(exception)
	except Exception as exception:
		return rollback_error(exception)
=======
    if not owner_or_admin(user_id):
        return error("Forbidden", 403)
    user = db.session.get(User, user_id)
    if user is None:
        return error("User not found", 404)
    payload, failure = json_payload()
    if failure:
        return failure
    if "role" in payload:
        return error("You cannot change your role", 403)
    password = payload.pop("password", None)
    if password is not None:
        payload["password_hash"] = password
    if "email" in payload and payload["email"] != user.email and User.query.filter_by(email=payload["email"]).first():
        return error("An account with that email already exists", 409)
    try:
        changes = user_schema.load(payload, partial=True)
        for field in ("name", "email", "role"):
            if getattr(changes, field, None) is not None:
                setattr(user, field, getattr(changes, field))
        if password is not None:
            user.password_hash = generate_password_hash(password)
        db.session.commit()
        return success(user_schema.dump(user), "User updated")
    except ValidationError as exception:
        return validation_error(exception)
    except Exception as exception:
        return rollback_error(exception)
>>>>>>> upstream/feature/browse-catalogue


@user_bp.delete("/users/<int:user_id>")
@jwt_required()
def delete_user(user_id):
    if not owner_or_admin(user_id):
        return error("Forbidden", 403)
    user = db.session.get(User, user_id)
    if user is None:
        return error("User not found", 404)
    try:
        db.session.delete(user)
        db.session.commit()
        return "", 204
    except Exception as exception:
        return rollback_error(exception)


@user_bp.put("/users/<int:user_id>/password")
@jwt_required()
def change_password(user_id):
    """Allow a user to change their own password."""
    if not owner_or_admin(user_id):
        return error("Forbidden", 403)

    user = db.session.get(User, user_id)
    if user is None:
        return error("User not found", 404)

    payload, failure = json_payload()
    if failure:
        return failure

    current_password = payload.get("current_password")
    new_password = payload.get("new_password")

    if not isinstance(current_password, str) or not isinstance(new_password, str):
        return error("Current password and new password are required", 400)

    if not check_password_hash(user.password_hash, current_password):
        return error("Current password is incorrect", 401)

    if len(new_password) < 8:
        return error("New password must be at least 8 characters", 400)

    try:
        user.password_hash = generate_password_hash(new_password)
        db.session.commit()
        return success(None, "Password changed successfully")
    except Exception as exception:
        return rollback_error(exception)