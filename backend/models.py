from backend import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    phonenumber = db.Column(db.String(64), index=True, unique=True)
    # 1025 will represent 10.25 
    balance = db.Column(db.Integer)

    def __repr__(self):
        return '<User {}>'.format(self.username)  

class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.String(280))
    answer1 = db.Column(db.String(100))
    answer2 = db.Column(db.String(100))
    answer3 = db.Column(db.String(100))
    correctAnswer = db.Column(db.String(2))

    def __repr__(self):
        return '<Question {}>'.format(self.id)  


