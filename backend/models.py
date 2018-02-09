from backend import db, login
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    phonenumber = db.Column(db.String(64), index=True, unique=True)
    # 1025 will represent 10.25 
    balance = db.Column(db.Integer)

    def __repr__(self):
        return '<User {}>'.format(self.username)  

@login.user_loader
def load_user(id):
    return User.query.get(int(id))
