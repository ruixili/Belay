from flask import Flask, render_template, request, jsonify
from functools import wraps
import string
import random
import datetime
import manager
import configparser
import io

app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

db_manager = manager.dbManager()

# helper functions
session_tokens = set()
def generate_session_token():
    session_token =  ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(6))
    while (session_token in session_tokens):
        session_token =  ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(6))
    session_tokens.add(session_token)
    return session_token


@app.route('/')
@app.route('/forgetpassword')
def index(chat_id=None):
    return app.send_static_file('index.html')

# -------------------------------- API ROUTES ----------------------------------

@app.route('/api/login', methods=['POST'])
def login ():
    # print("----- calling login method!")
    user = {key: request.form.get(key) for key in request.form}
    # print(user)
    data = db_manager.login(user)
    token = generate_session_token()
    # print(data)
    return jsonify({"data": data, "token": token})


@app.route('/api/signup', methods=['POST'])
def signup ():
    # print("----- calling signup method!")
    user = {key: request.form.get(key) for key in request.form}
    # print(user)

    status = db_manager.signup(user)
    return jsonify(status)


@app.route('/api/forgetpassword', methods=['POST'])
def forgetpassword():
    # print("----- calling forgetpassword method!")
    user = {key: request.form.get(key) for key in request.form}
    user['url'] = request.url_root
    # print(user)

    status = manager.forgetPassword(user)
    return jsonify(status)


@app.route('/api/changepassword', methods=['POST'])
def changepassword():
    if request.cookies['cookie'] not in session_tokens:
        return "", 401
    # print("----- calling changepassword method!")
    user = {key: request.form.get(key) for key in request.form}
    # print(user)

    status = db_manager.changePassword(user)
    return jsonify(status)


@app.route('/api/changeusername', methods=['POST'])
def changeusername():
    if request.cookies['cookie'] not in session_tokens:
        return "", 401
    print("----- calling changeusername method!")
    user = {key: request.form.get(key) for key in request.form}
    # print(user)

    status = db_manager.changeUsername(user)
    return jsonify(status)


@app.route('/api/getchannels', methods=['POST'])
def getchannels ():
    print("----- calling getchannels method!")
    print(request.cookies['cookie'])
    print(session_tokens)
    if request.cookies['cookie'] not in session_tokens:
        return "", 401
    user = {key: request.form.get(key) for key in request.form}
    # print(user)

    channels = db_manager.getChannels()
    # print(channels)
    return jsonify(channels)


@app.route('/api/createchannel', methods=['POST'])
def createchannel ():
    if request.cookies['cookie'] not in session_tokens:
        return "", 401
    # print("----- calling createchannel method!")
    channel = {key: request.form.get(key) for key in request.form}
    # print(channel)

    status = db_manager.createChannel(channel)
    # print(status)
    return jsonify(status)


@app.route('/api/moremessage', methods=['POST'])
def moremessage():
    if request.cookies['cookie'] not in session_tokens:
        return "", 401
    # print("----- calling moremessage method!")
    channel = {key: request.form.get(key) for key in request.form}
    # print(channel)
    messages = db_manager.moreMessage(channel)
    return jsonify(messages)


@app.route('/api/postmessage', methods=['POST'])
def postmessage():
    if request.cookies['cookie'] not in session_tokens:
        print("----- request.cookies['cookie'] not in session_tokens")
        return "", 401
    print("----- calling postmessage method!")
    message = {key: request.form.get(key) for key in request.form}
    print(message)
    result = db_manager.postMessage(message)
    return jsonify(result)


@app.route('/api/getmessage', methods=['POST'])
def getmessage():
    if request.cookies['cookie'] not in session_tokens:
        return "", 401
    # print("----- calling getmessage method!")
    channel = {key: request.form.get(key) for key in request.form}
    # print(channel)
    messages = db_manager.getMessage(channel)
    return jsonify(messages)


@app.route('/api/getunreadmessagecount', methods=['POST'])
def getunreadmessagecount():
    print("----- calling getunreadmessagecount method!")
    print(request.cookies['cookie'])
    print(session_tokens)

    if request.cookies['cookie'] not in session_tokens:
        return "", 401
    channel = {key: request.form.get(key) for key in request.form}
    # print(channel)
    count = db_manager.getUnreadMessageCount(channel)
    return jsonify(count)


@app.route('/api/loadthreadmassage', methods=['POST'])
def loadthreadmassage():
    if request.cookies['cookie'] not in session_tokens:
        return "", 401
    thread = {key: request.form.get(key) for key in request.form}
    print(thread)
    messages = db_manager.loadThreadMessage(thread)
    return jsonify(messages)


@app.route('/api/sendthreadmessage', methods=['POST'])
def sendthreadmessage():
    if request.cookies['cookie'] not in session_tokens:
        return "", 401
    # print("----- calling sendthreadmessage method!")
    message = {key: request.form.get(key) for key in request.form}
    print(message)
    status = db_manager.sendThreadMessage(message)
    return jsonify(status)


if __name__ == '__main__':
    app.run(debug=True)