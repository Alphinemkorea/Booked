"""UserSettings model for storing user notification and UI preferences."""

from .db import db

class UserSettings(db.Model):
    __tablename__ = 'user_settings'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, unique=True)
    theme = db.Column(db.String(20), default='light', nullable=False)
    email_notifications = db.Column(db.Boolean, default=True, nullable=False)
    lending_notifications = db.Column(db.Boolean, default=True, nullable=False)

    user = db.relationship('User', backref=db.backref('settings', uselist=False, cascade='all, delete-orphan'))

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "theme": self.theme,
            "email_notifications": self.email_notifications,
            "lending_notifications": self.lending_notifications
        }