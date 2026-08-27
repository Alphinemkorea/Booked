from extensions import db
from datetime import datetime

class Lending(db.Model):
    id = db.Column(db.Integer,nullable = False)
    user_id = db.Column()
    book_id = db.Column()
    status = db.Column()
    price_at_purchase = db.Column(db.Integer)
    date_requested = db.Column()
    due_date = db.Column()
    date_returned = db.Column()
    
