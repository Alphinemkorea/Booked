from extensions import db

class Book(db.Model):
    __tablename__ = "books"
    id = db.Column(db.Integer, primary_key = True , nullable = False)
    name = db.Column(db.String(50),nullable = False)
    author = db.Column(db.String(50),nullable = False)
    genre = db.Column(db.String(50),nullable = False)