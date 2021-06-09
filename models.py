from app import app # import flask application from app.py
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from flask_whooshee import Whooshee


db = SQLAlchemy(app)

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True)
    mail = db.Column(db.String(100), unique=True)
    role = db.Column(db.String(80))
    phone = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(80))
    created = db.Column(db.String(30))
    updated = db.Column(db.String(30))
    engine = db.relationship('Engine', backref='owner')
     
    def __init__(self, **kwargs):
        super(User, self).__init__(**kwargs)

class Engine(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    matricule = db.Column(db.String(100))
    owner_id =db.Column(db.Integer, db.ForeignKey('user.id'))
    type = db.Column(db.String(80))
    start_date = db.Column(db.String(80))
    end_date = db.Column(db.String(80))
    payment_amount = db.Column(db.String(80))
    payed = db.Column(db.Boolean, default=False)
    created = db.Column(db.String(30))
    updated = db.Column(db.String(30))

