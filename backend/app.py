import base64
import hashlib
import hmac
import json
import os
import time
from functools import wraps

from flask import Flask, jsonify, request

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "dev-secret-change-me")
app.config["JWT_ALGORITHM"] = os.getenv("JWT_ALGORITHM", "HS256")
app.config["JWT_TTL_SECONDS"] = int(os.getenv("JWT_TTL_SECONDS", "3600"))
app.config["CORS_ALLOWED_ORIGIN"] = os.getenv("CORS_ALLOWED_ORIGIN", "*")


def _hash_password(password):
    salt = b"booked-salt"
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 100_000)
    return digest.hex()


USERS = [
    {
        "id": 1,
        "name": "Admin User",
        "email": "admin@booked.local",
        "password": _hash_password("admin123"),
        "role": "admin",
        "active": True,
    },
    {
        "id": 2,
        "name": "Standard User",
        "email": "user@booked.local",
        "password": _hash_password("user123"),
        "role": "user",
        "active": True,
    },
]


def _b64url_encode(data):
    if isinstance(data, str):
        encoded = base64.urlsafe_b64encode(data.encode("utf-8"))
    else:
        encoded = base64.urlsafe_b64encode(data)
    return encoded.decode("utf-8").rstrip("=")


def _b64url_decode(data):
    padded = data + ("=" * (-len(data) % 4))
    return base64.urlsafe_b64decode(padded.encode("utf-8"))


def _verify_password(password, hashed_password):
    return _hash_password(password) == hashed_password


def _serialize_user(user):
    return {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "role": user["role"],
        "active": user["active"],
    }


def _find_user_by_email(email):
    for user in USERS:
        if user["email"].lower() == (email or "").lower():
            return user
    return None


def _find_user_by_id(user_id):
    for user in USERS:
        if str(user["id"]) == str(user_id):
            return user
    return None


def _issue_token(user):
    timestamp = int(time.time())
    payload = {
        "sub": str(user["id"]),
        "email": user["email"],
        "role": user["role"],
        "iat": timestamp,
        "exp": timestamp + app.config["JWT_TTL_SECONDS"],
    }

    encoded_header = _b64url_encode(json.dumps({"alg": app.config["JWT_ALGORITHM"], "typ": "JWT"}, separators=(",", ":")))
    encoded_payload = _b64url_encode(json.dumps(payload, separators=(",", ":")))
    signing_input = f"{encoded_header}.{encoded_payload}".encode("utf-8")
    signature = hmac.new(
        app.config["JWT_SECRET_KEY"].encode("utf-8"),
        signing_input,
        hashlib.sha256,
    ).digest()
    encoded_signature = _b64url_encode(signature)
    return f"{encoded_header}.{encoded_payload}.{encoded_signature}"


def _decode_token(token):
    if not token or token.count(".") != 2:
        raise ValueError("Malformed token")

    header_b64, payload_b64, signature_b64 = token.split(".")
    signing_input = f"{header_b64}.{payload_b64}".encode("utf-8")
    expected_signature = hmac.new(
        app.config["JWT_SECRET_KEY"].encode("utf-8"),
        signing_input,
        hashlib.sha256,
    ).digest()
    actual_signature = _b64url_decode(signature_b64)
    if not hmac.compare_digest(actual_signature, expected_signature):
        raise ValueError("Invalid token signature")

    payload = json.loads(_b64url_decode(payload_b64).decode("utf-8"))
    if payload.get("exp", 0) < int(time.time()):
        raise ValueError("Token expired")
    if not payload.get("sub"):
        raise ValueError("Token missing subject")
    return payload


def _get_auth_error_response(message, status_code):
    return jsonify({"error": message}), status_code


def require_auth(view):
    @wraps(view)
    def wrapped(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header or not auth_header.startswith("Bearer "):
            return _get_auth_error_response("Missing or invalid Authorization header", 401)

        token = auth_header.split(" ", 1)[1].strip()
        if not token:
            return _get_auth_error_response("Missing or invalid Authorization header", 401)

        try:
            payload = _decode_token(token)
        except ValueError as exc:
            return _get_auth_error_response(str(exc), 401)

        user = _find_user_by_id(payload.get("sub"))
        if not user:
            return _get_auth_error_response("User not found", 401)
        if not user.get("active", True):
            return _get_auth_error_response("User account is inactive", 403)

        return view(user, *args, **kwargs)

    return wrapped


def admin_required(view):
    @wraps(view)
    def wrapped(user, *args, **kwargs):
        if user.get("role") != "admin":
            return _get_auth_error_response("Admin access required", 403)
        return view(user, *args, **kwargs)

    return wrapped


@app.after_request
def add_cors_headers(response):
    origin = request.headers.get("Origin")
    allowed_origin = app.config["CORS_ALLOWED_ORIGIN"]
    response.headers["Access-Control-Allow-Origin"] = origin if origin and origin != "null" else allowed_origin
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With, Accept, Origin"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Vary"] = "Origin"
    return response


@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        return "", 204


@app.get('/')
def home():
    return {"message": "Booked API is running!"}


@app.post('/api/auth/login')
def login():
    payload = request.get_json(silent=True) or {}
    email = (payload.get("email") or "").strip()
    password = payload.get("password") or ""
    if not email or not password:
        return _get_auth_error_response("email and password are required", 400)

    user = _find_user_by_email(email)
    if not user or not _verify_password(password, user["password"]):
        return _get_auth_error_response("Invalid email or password", 401)
    if not user.get("active", True):
        return _get_auth_error_response("User account is inactive", 403)

    token = _issue_token(user)
    return jsonify({"access_token": token, "token_type": "bearer", "user": _serialize_user(user)})


@app.get('/api/auth/me')
@require_auth
def get_current_user(user):
    return jsonify({"user": _serialize_user(user)})


@app.get('/api/admin/users')
@require_auth
@admin_required
def list_users(user):
    return jsonify({"users": [_serialize_user(item) for item in USERS]})


@app.post('/api/admin/users')
@require_auth
@admin_required
def create_user(user):
    payload = request.get_json(silent=True) or {}
    name = (payload.get("name") or "").strip()
    email = (payload.get("email") or "").strip()
    password = payload.get("password") or ""
    role = (payload.get("role") or "user").strip() or "user"

    if not name or not email or not password:
        return _get_auth_error_response("name, email and password are required", 400)
    if not email.endswith("@") and "@" not in email:
        return _get_auth_error_response("email is invalid", 400)
    if role not in {"user", "admin"}:
        return _get_auth_error_response("role must be user or admin", 400)
    if _find_user_by_email(email):
        return _get_auth_error_response("user with this email already exists", 409)

    created_user = {
        "id": max((item["id"] for item in USERS), default=0) + 1,
        "name": name,
        "email": email,
        "password": _hash_password(password),
        "role": role,
        "active": True,
    }
    USERS.append(created_user)
    return jsonify({"user": _serialize_user(created_user)}), 201


@app.get('/api/admin/users/<int:user_id>')
@require_auth
@admin_required
def get_user_by_id(user, user_id):
    found = _find_user_by_id(user_id)
    if not found:
        return _get_auth_error_response("User not found", 404)
    return jsonify({"user": _serialize_user(found)})


@app.put('/api/admin/users/<int:user_id>')
@require_auth
@admin_required
def update_user(user, user_id):
    found = _find_user_by_id(user_id)
    if not found:
        return _get_auth_error_response("User not found", 404)

    payload = request.get_json(silent=True) or {}
    if "name" in payload:
        found["name"] = (payload["name"] or "").strip() or found["name"]
    if "email" in payload:
        email = (payload["email"] or "").strip()
        if not email:
            return _get_auth_error_response("email is required", 400)
        if _find_user_by_email(email) and _find_user_by_email(email)["id"] != found["id"]:
            return _get_auth_error_response("user with this email already exists", 409)
        found["email"] = email
    if "role" in payload:
        role = (payload["role"] or "").strip() or found["role"]
        if role not in {"user", "admin"}:
            return _get_auth_error_response("role must be user or admin", 400)
        found["role"] = role
    if "active" in payload:
        found["active"] = bool(payload["active"])

    return jsonify({"user": _serialize_user(found)})


@app.delete('/api/admin/users/<int:user_id>')
@require_auth
@admin_required
def delete_user(user, user_id):
    found_index = None
    for index, item in enumerate(USERS):
        if item["id"] == user_id:
            found_index = index
            break

    if found_index is None:
        return _get_auth_error_response("User not found", 404)

    deleted_user = USERS.pop(found_index)
    return jsonify({"deleted": True, "user": _serialize_user(deleted_user)})


@app.post('/api/admin/users/<int:user_id>/quick-action')
@require_auth
@admin_required
def quick_action(user, user_id):
    found = _find_user_by_id(user_id)
    if not found:
        return _get_auth_error_response("User not found", 404)

    payload = request.get_json(silent=True) or {}
    action = (payload.get("action") or "").strip()
    if not action:
        return _get_auth_error_response("action is required", 400)

    if action == "toggle_active":
        found["active"] = not found["active"]
        return jsonify({"user": _serialize_user(found)})
    if action == "make_admin":
        found["role"] = "admin"
        return jsonify({"user": _serialize_user(found)})
    if action == "reset_password":
        password = payload.get("password") or ""
        if not password:
            return _get_auth_error_response("password is required for reset_password", 400)
        found["password"] = _hash_password(password)
        return jsonify({"user": _serialize_user(found)})

    return _get_auth_error_response("Unsupported quick action", 400)


@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Not Found"}), 404


@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({"error": "Method Not Allowed"}), 405


@app.errorhandler(Exception)
def handle_unexpected_error(error):
    app.logger.exception("Unhandled exception", exc_info=error)
    return jsonify({"error": "Internal Server Error"}), 500


if __name__ == '__main__':
    app.run(debug=True)
