import pytest
from werkzeug.security import generate_password_hash
from flask_jwt_extended import create_access_token

from app import create_app
from models import Book, User, Lending, db


@pytest.fixture
def app():
    app = create_app({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        "JWT_SECRET_KEY": "test-secret-key",
    })

    with app.app_context():
        db.create_all()

        user = User(
            name="Test User",
            email="test@example.com",
            password_hash=generate_password_hash("password123"),
            role="user",
        )

        admin = User(
            name="Admin User",
            email="admin@example.com",
            password_hash=generate_password_hash("admin123"),
            role="admin",
        )

        book = Book(
            title="Test Book",
            author="Test Author",
            price=10.00,
            stock_quantity=5,
        )

        db.session.add_all([user, admin, book])
        db.session.commit()

    yield app

    with app.app_context():
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def user_token(app):
    with app.app_context():
        return create_access_token(
            identity="1",
            additional_claims={"role": "user"},
        )


@pytest.fixture
def admin_token(app):
    with app.app_context():
        return create_access_token(
            identity="2",
            additional_claims={"role": "admin"},
        )


def test_home(client):
    response = client.get("/")

    assert response.status_code == 200
    assert response.json["message"] == "Booked API is running!"


def test_create_lending(client, user_token):
    response = client.post(
        "/api/lendings",
        json={
            "book_id": 1,
        },
        headers={
            "Authorization": f"Bearer {user_token}",
        },
    )

    assert response.status_code == 201
    assert response.json["message"] == "Lending requested"
    assert response.json["data"]["status"] == "requested"


def test_admin_can_approve_lending(client, user_token, admin_token, app):
    # Create lending request
    response = client.post(
        "/api/lendings",
        json={"book_id": 1},
        headers={"Authorization": f"Bearer {user_token}"},
    )

    assert response.status_code == 201
    lending_id = response.json["data"]["id"]

    # Admin approves it
    response = client.put(
        f"/api/lendings/{lending_id}/approve",
        headers={"Authorization": f"Bearer {admin_token}"},
    )

    assert response.status_code == 200
    assert response.json["data"]["status"] == "approved"

    # Stock should decrease
    with app.app_context():
        book = db.session.get(Book, 1)
        assert book.stock_quantity == 4


def test_admin_can_reject_lending(client, user_token, admin_token):
    response = client.post(
        "/api/lendings",
        json={"book_id": 1},
        headers={"Authorization": f"Bearer {user_token}"},
    )

    assert response.status_code == 201
    lending_id = response.json["data"]["id"]

    response = client.put(
        f"/api/lendings/{lending_id}/reject",
        headers={"Authorization": f"Bearer {admin_token}"},
    )

    assert response.status_code == 200
    assert response.json["data"]["status"] == "rejected"


def test_user_cannot_approve_lending(client, user_token, admin_token):
    response = client.post(
        "/api/lendings",
        json={"book_id": 1},
        headers={"Authorization": f"Bearer {user_token}"},
    )

    lending_id = response.json["data"]["id"]

    response = client.put(
        f"/api/lendings/{lending_id}/approve",
        headers={"Authorization": f"Bearer {user_token}"},
    )

    assert response.status_code == 403


def test_user_can_return_approved_lending(
    client,
    user_token,
    admin_token,
    app,
):
    # Create lending
    response = client.post(
        "/api/lendings",
        json={"book_id": 1},
        headers={"Authorization": f"Bearer {user_token}"},
    )

    lending_id = response.json["data"]["id"]

    # Approve lending
    response = client.put(
        f"/api/lendings/{lending_id}/approve",
        headers={"Authorization": f"Bearer {admin_token}"},
    )

    assert response.status_code == 200

    # Return book
    response = client.put(
        f"/api/lendings/{lending_id}/return",
        headers={"Authorization": f"Bearer {user_token}"},
    )

    assert response.status_code == 200
    assert response.json["data"]["status"] == "returned"

    # Stock should be restored
    with app.app_context():
        book = db.session.get(Book, 1)
        assert book.stock_quantity == 5


def test_cannot_return_requested_lending(client, user_token):
    response = client.post(
        "/api/lendings",
        json={"book_id": 1},
        headers={"Authorization": f"Bearer {user_token}"},
    )

    lending_id = response.json["data"]["id"]

    response = client.put(
        f"/api/lendings/{lending_id}/return",
        headers={"Authorization": f"Bearer {user_token}"},
    )

    assert response.status_code == 409


def test_user_can_change_password(client):
    login_response = client.post(
        "/api/login",
        json={
            "email": "test@example.com",
            "password": "password123",
        },
    )

    assert login_response.status_code == 200
    token = login_response.json["data"]["access_token"]

    response = client.put(
        "/api/users/1/password",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "current_password": "password123",
            "new_password": "newpassword123",
        },
    )

    assert response.status_code == 200
