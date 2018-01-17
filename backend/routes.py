# -*- coding: utf-8 -*-
from backend import app 
from flask import jsonify
from flask import request
from datetime import datetime
from datetime import timedelta

#startTime = datetime(2018,1,13,11,15) 
startTime = datetime.now() + timedelta(seconds = 2)
interval = 8000

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

@app.route('/api/login', methods = ['POST'])
def login():
    users = { '1' : '1'}
    json = request.get_json()
    data = {}

    if json['email'] in users:
        if json['password'] == users[json['email']]:
            data['message'] = 'Access Granted' 
            print('Access granted')
        else:
            data['message'] = 'Invalid Password'
            print('Wrong password')
    else:
        data['message'] = 'Unfortunately, we could not find your account. You can register by clicking on \'Sign Up\''
        print('Email not registered')

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

app.run()
