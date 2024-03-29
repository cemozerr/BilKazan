# -*- coding: utf-8 -*-
from twilio.rest import Client
from . import app
import random


def send_confirmation_code(to_number, phoneCodeDict):
    verification_code = generate_code()
    print(verification_code)
    send_sms(to_number, verification_code)
    return verification_code


def generate_code():
    return str(random.randrange(1000, 9999))


def send_sms(to_number, body):
    account_sid = app.config['TWILIO_ACCOUNT_SID']
    auth_token = app.config['TWILIO_AUTH_TOKEN']
    twilio_number = app.config['TWILIO_NUMBER']
    client = Client(account_sid, auth_token)
    client.api.messages.create(to_number,
                           from_=twilio_number,
                           body=body)
