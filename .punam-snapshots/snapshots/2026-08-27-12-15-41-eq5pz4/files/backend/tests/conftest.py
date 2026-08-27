"""Shared pytest fixtures across backend tests."""

import pytest
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash

from app import create_app
from models import Book, User, db


@pytest.fixture
def app():
    app = create_app(
        {
            "TESTING": True,
            "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
            "JWT_SECRET_KEY": "test-secret-key-for-booked-tests-32-bytes",
        }
    )

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