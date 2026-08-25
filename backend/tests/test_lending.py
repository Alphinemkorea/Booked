import pytest
from werkzeug.security import generate_password_hash

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

        book = Book(
            title="Test Book",
            author="Test Author",
            price=10.00,
            stock_quantity=5,
        )

        db.session.add(user)
        db.session.add(book)
        db.session.commit()

    yield app

    with app.app_context():
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    return app.test_client()


def test_home(client):
    response = client.get("/")

    assert response.status_code == 200
    assert response.json["message"] == "Booked API is running!"