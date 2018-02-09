# -*- coding: utf-8 -*-
from backend import app 
from flask import jsonify
from flask import request
from datetime import datetime
from datetime import timedelta
from flask_login import current_user, login_user
from backend.models import User
from .confirmation_sender import send_confirmation_code

#startTime = datetime(2018,1,13,11,15) 
startTime = datetime.now() + timedelta(seconds = 25)
interval = 8000
phoneCodeDict = {}

questionDB = {
        0:{
            'questionNumber': '1',
            'question': 'bu birinci soru?',
            'answer1': '1111',
            'answer2': '2222',
            'answer3': '3333',
            'correctAnswer' : '0' 
        }, 
        1:{
            'questionNumber': '2',
            'question': 'bu ikinci soru?',
            'answer1': '1111',
            'answer2': '2222',
            'answer3': '3333',
            'correctAnswer' : '2' 
        }, 
        2:{
            'questionNumber': '3',
            'question': 'bu ucuncu soru?',
            'answer1': '1111',
            'answer2': '2222',
            'answer3': '3333',
            'correctAnswer' : '1' 
        },
        3:{
            'questionNumber': '4',
            'question': 'bu ucuncu soru?',
            'answer1': '1111',
            'answer2': '2222',
            'answer3': '3333',
            'correctAnswer' : '2' 
        },
        4:{
            'questionNumber': '5',
            'question': 'bu ucuncu soru?',
            'answer1': '1111',
            'answer2': '2222',
            'answer3': '3333',
            'correctAnswer' : '1'
        },
        5:{
            'questionNumber': '6',
            'question': 'bu ucuncu soru?',
            'answer1': '1111',
            'answer2': '2222',
            'answer3': '3333',
            'correctAnswer' : '0'
        }
}

@app.route('/api/sendvercode', methods = ['POST'])
def sendverificaton():
    data = {}
    json = request.get_json()
    send_confirmation_code(json['phone'], phoneCodeDict)

    response = jsonify(data)
    response.status_code = 200
    print('Sending response')
    return response

@app.route('/api/verify', methods = ['POST'])
def verifyphone():
    data = {}
    json = request.get_json()
    if json['code'] == phoneCodeDict[json['phone']]:
        data['message'] = 'Access Granted'
        del phoneCodeDict[json['phone']]
        print('Access granted')
    else:
        data['verification'] = 'Code Wrong'
        
    response = jsonify(data)
    response.status_code = 200
    print('Sending response')
    return response

@app.route('/api/registerUser', methods = ['POST'])
def registeruser():
    data = {}
    json = request.get_json()

    if json['username'] == '1':
        data['message'] = 'Access Granted'
    else:
        data['message'] = 'Username is taken'

    response = jsonify(data)
    response.status_code = 200
    print('Sending response')
    return response 

@app.route('/api/login', methods = ['POST'])
def login():
    data = {}
    json = request.get_json()

    if current_user.is_authenticated:
        data['message'] = 'Access Granted' 

    user = User.query.filter_by(username=json['email']).first()
    if user is None or not user.check_password(json['password']):
        data['message'] = 'Invalid Password'
    else:
        login_user(user)
        data['message'] = 'Access Granted' 

    response = jsonify(data)
    response.status_code = 200
    print('Sending response')
    return response 


@app.route('/api/getQuestion', methods = ['GET'])
def getQuestion():
    data = {}
    questionNumber = getQuestionNumber() 

    data['questionNumber'] = questionDB[questionNumber]['questionNumber']
    data['question'] =  questionDB[questionNumber]['question']  
    data['answer1'] = questionDB[questionNumber]['answer1']
    data['answer2'] = questionDB[questionNumber]['answer2'] 
    data['answer3'] = questionDB[questionNumber]['answer3'] 
    response = jsonify(data)
    response.status_code = 200
    print('Sending response')
    return response

@app.route('/api/getAnswer', methods = ['GET'])
def getAnswer():
    data = {}
    questionNumber = getQuestionNumber() 

    data['correctAnswer'] = questionDB[questionNumber]['correctAnswer'] 
    data['questionNumber'] = questionDB[questionNumber]['questionNumber']
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

def getQuestionNumber():
    # time since game started in microseconds
    timeSinceStart = ((datetime.now() - startTime).total_seconds() * 1000)

    # current question number assuming that each question takes interval seconds 
    questionNumber = int(timeSinceStart / interval)

    if questionNumber > 5:
        return 5
    return questionNumber
