from backend import db, login

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    phonenumber = db.Column(db.String(64), index=True, unique=True)
    # 1025 will represent 10.25 
    balance = db.Column(db.Integer)

    def __repr__(self):
        return '<User {}>'.format(self.username)  
