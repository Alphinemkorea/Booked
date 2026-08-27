from extensions import db

class Order(db.Model):

    __tablename__ = "orders"
    id = db.Column(db.Integer,primary_key = True)
    user_id = db.Column()
    status = db.Column()
    price_at_purchase = db.Column()
    date_ordered = db.Column()
    