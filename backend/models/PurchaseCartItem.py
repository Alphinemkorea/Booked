from extensions import db
from datetime import datetime

class PurchaseCartItem(db.Model):
    id = db.Column(db.Integer,nullable = False)
    user_id = db.Column()
    book_id = db.Column()
    quantity = db.Column(db.Integer)
    date_added = db.Column()
