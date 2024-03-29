# -*- coding: utf-8 -*-
from backend import app 
from backend import db
from flask import jsonify
from flask import request
from datetime import datetime
from datetime import timedelta
from flask_login import current_user, login_user
from backend.models import User, Question
from .confirmation_sender import send_confirmation_code

#startTime = datetime(2018,1,13,11,15) 
nextGameDateTime = 'Yarin 20:00'
nextGamePrize = '2500 TL'
startTime = datetime.now() + timedelta(seconds = 30)
interval = 8000
phoneCodeDict = {}
gameQuestionIds = [1,2,3,4]

questionDB = map(Question.query.get, gameQuestionIds)

@app.route('/api/sendvercode', methods = ['POST'])
def sendverificaton():
    data = {}
    json = request.get_json()
    verification_code =  send_confirmation_code(json['phone'], phoneCodeDict)
    phoneCodeDict[str(json['phone'])] = verification_code

    response = jsonify(data)
    response.status_code = 200
    print('Sending response')
    return response

@app.route('/api/verify', methods = ['POST'])
def verifyphone():
    data = {}
    json = request.get_json()
    #print(json['phone'])

    if json['code'] == phoneCodeDict[str(json['phone'])]:
        user = User.query.filter_by(phonenumber=json['phone']).first()
        if user is None:
            data['message'] = 'New Phone Being Registered'
        else:
            data['message'] = 'Access Granted'
        print('deleting phone from phoneCodeDict');
        del phoneCodeDict[json['phone']]
    else:
        data['message'] = 'Code Wrong'

    response = jsonify(data)
    response.status_code = 200
    print(data['message'])
    print('Sending response')
    return response

@app.route('/api/registerUser', methods = ['POST'])
def registeruser():
    data = {}
    json = request.get_json()

    if User.query.filter_by(username=unicode(json['username'])).first() is None:
        data['message'] = 'Access Granted'
        newUser = User(
                username=unicode(json['username']),
                phonenumber=unicode(json['phone']),
                balance=0
                )
        db.session.add(newUser)
        db.session.commit()
    else:
        data['message'] = 'Username is taken'

    response = jsonify(data)
    response.status_code = 200
    print('Sending response')
    return response 

@app.route('/api/getWaitGameData', methods = ['POST'])
def login():
    data = {}
    json = request.get_json()

    user = User.query.filter_by(phonenumber=unicode(json['phone'])).first()
    data['nextGameDateTime'] = nextGameDateTime
    data['nextGamePrize'] = nextGamePrize;
    data['username'] = user.username
    data['userBalance'] = user.balance

    response = jsonify(data)
    response.status_code = 200
    print('Sending response')
    return response 


@app.route('/api/getQuestion', methods = ['POST'])
def getQuestion():
    data = {}
    json = request.get_json()
    questionNumber = int(json['number'])

    data['question'] =  str(questionDB[questionNumber].question)
    data['answer1'] = str(questionDB[questionNumber].answer1)
    data['answer2'] = str(questionDB[questionNumber].answer2)
    data['answer3'] = str(questionDB[questionNumber].answer3) 
    response = jsonify(data)
    response.status_code = 200
    print('Sending response')
    return response

@app.route('/api/getAnswer', methods = ['POST'])
def getAnswer():
    data = {}
    json = request.get_json()
    questionNumber = int(json['number'])

    data['correctAnswer'] = str(questionDB[questionNumber].correctAnswer)
    response = jsonify(data)
    response.status_code = 200
    print('Sending response')
    return response

@app.route('/api/timeToStart', methods = ['GET'])
def timeToStart():
    print('Calculating timeToStart')
    data = {}
    diff = startTime - datetime.now()
    data['timeToStart'] = diff.total_seconds() * 1000
    response = jsonify(data)
    response.status_code = 200
    print('Sending response')
    return response 
