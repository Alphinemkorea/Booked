"""Tests for UserSettings model functionality."""

import pytest
from models import User, UserSettings, db


def test_default_user_settings_creation(app):
    with app.app_context():
        user = User(
            name="Settings User",
            email="settings@example.com",
            password_hash="hashed_pw",
        )
        db.session.add(user)
        db.session.commit()

        settings = UserSettings(user_id=user.id)
        db.session.add(settings)
        db.session.commit()

        retrieved = UserSettings.query.filter_by(user_id=user.id).first()
        assert retrieved is not None
        assert retrieved.theme == "light"
        assert retrieved.email_notifications is True
        assert retrieved.lending_notifications is True


def test_user_settings_to_dict(app):
    with app.app_context():
        user = User(
            name="Dict User",
            email="dict@example.com",
            password_hash="hashed_pw",
        )
        db.session.add(user)
        db.session.commit()

        settings = UserSettings(
            user_id=user.id,
            theme="dark",
            email_notifications=False,
            lending_notifications=True,
        )
        db.session.add(settings)
        db.session.commit()

        data = settings.to_dict()
        assert data["theme"] == "dark"
        assert data["email_notifications"] is False
        assert data["lending_notifications"] is True
        assert data["user_id"] == user.id


def test_cascade_delete_user_settings(app):
    with app.app_context():
        user = User(
            name="Delete User",
            email="delete@example.com",
            password_hash="hashed_pw",
        )
        db.session.add(user)
        db.session.commit()

        settings = UserSettings(user_id=user.id)
        db.session.add(settings)
        db.session.commit()

        user_id = user.id
        db.session.delete(user)
        db.session.commit()

        assert UserSettings.query.filter_by(user_id=user_id).first() is None


def test_get_user_settings_route(client, user_token):
    response = client.get(
        "/api/users/settings",
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert response.status_code == 200
    assert response.json["data"]["theme"] == "light"
    assert response.json["data"]["email_notifications"] is True
    assert response.json["data"]["lending_notifications"] is True


def test_update_user_settings_route(client, user_token):
    response = client.put(
        "/api/users/settings",
        json={
            "theme": "dark",
            "email_notifications": False,
        },
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert response.status_code == 200
    assert response.json["data"]["theme"] == "dark"
    assert response.json["data"]["email_notifications"] is False
    assert response.json["data"]["lending_notifications"] is True