import os

from flask import Flask
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate

from models import db
from schemas import ma

jwt = JWTManager()

def create_app(test_config=None):
    """Create and configure the Booked Flask application."""
    app = Flask(__name__)
    app.config.from_mapping(
        SQLALCHEMY_DATABASE_URI=os.getenv("DATABASE_URL", "sqlite:///booked.db"),
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        JWT_SECRET_KEY=os.getenv("JWT_SECRET_KEY", "change-this-in-production"),
    )
    if test_config:
        app.config.update(test_config)

    db.init_app(app)
    ma.init_app(app)
    jwt.init_app(app)
    Migrate(app, db)

    from controllers import register_blueprints

    register_blueprints(app)

    @app.get('/')
    def home():
        return {"message": "Booked API is running!"}

    return app


app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
