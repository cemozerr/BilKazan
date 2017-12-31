from backend import app
from flask import jsonify
from flask import request

@app.route('/api/login', methods = ['POST'])
def index():
    users = { '1' : '1'}
    json = request.get_json()
    data = {}

    if json['email'] in users:
        if json['password'] == users[json['email']]:
            data['message'] = 'Access Granted' 
            print 'Access granted'
        else:
            data['message'] = 'Invalid Password'
            print 'Wrong password'
    else:
        data['message'] = 'Unfortunately, we could not find your account. You can register by clicking on \'Sign Up\''
        print 'Email not registered'

    response = jsonify(data)
    response.status_code = 200
    print 'Sending response'
    return response 

