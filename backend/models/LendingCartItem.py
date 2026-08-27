from extensions import db
from datetime import datetime

class LendingCartItem(db.Model):
    id = db.Column(db.Integer,primary_key = True)
    user_id = db.Column()
    book_id = db.Column()
    date_added = db.Column()

