import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config(object):
    SECRET_KEY = 'SOME_SECRET_KEY'
    TWILIO_ACCOUNT_SID = 'AC75fd9d7e943b776c2c26bc3acb524aee'
    TWILIO_AUTH_TOKEN = '06c1c2b77aa4f5854ea6e04b9e7670f3'
    TWILIO_NUMBER = '+13312534308' 


    # will define the configuration here
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'backend.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

