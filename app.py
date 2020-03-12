from flask import Flask, render_template, request, jsonify
from functools import wraps
import string
import random
import datetime
import manager

app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
db_manager = manager.dbManager()

# helper functions
session_tokens = set()
def generate_session_token():
    session_token =  ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(6))
    while (session_token in session_tokens):
        session_token =  ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(6))
    
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
    # print(status)
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
    # print("----- calling changepassword method!")
    user = {key: request.form.get(key) for key in request.form}
    # print(user)

    status = db_manager.changePassword(user)
    return jsonify(status)


@app.route('/api/changeusername', methods=['POST'])
def changeusername():
    print("----- calling changeusername method!")
    user = {key: request.form.get(key) for key in request.form}
    # print(user)

    status = db_manager.changeUsername(user)
    return jsonify(status)


@app.route('/api/getchannels', methods=['POST'])
def getchannels ():
    # print("----- calling getchannels method!")
    user = {key: request.form.get(key) for key in request.form}
    # print(user)

    channels = db_manager.getChannels()
    # print(channels)
    return jsonify(channels)


@app.route('/api/createchannel', methods=['POST'])
def createchannel ():
    # print("----- calling createchannel method!")
    channel = {key: request.form.get(key) for key in request.form}
    # print(channel)

    status = db_manager.createChannel(channel)
    # print(status)
    return jsonify(status)


@app.route('/api/moremessage', methods=['POST'])
def moremessage():
    # print("----- calling moremessage method!")
    channel = {key: request.form.get(key) for key in request.form}
    # print(channel)
    messages = db_manager.moreMessage(channel)
    return jsonify(messages)


@app.route('/api/postmessage', methods=['POST'])
def postmessage():
    # print("----- calling postmessage method!")
    message = {key: request.form.get(key) for key in request.form}
    # print(message)
    result = db_manager.postMessage(message)
    return jsonify(result)


@app.route('/api/getmessage', methods=['POST'])
def getmessage():
    # print("----- calling getmessage method!")
    channel = {key: request.form.get(key) for key in request.form}
    # print(channel)
    messages = db_manager.getMessage(channel)
    return jsonify(messages)


@app.route('/api/getunreadmessagecount', methods=['POST'])
def getunreadmessagecount():
    # print("----- calling getunreadmessagecount method!")
    channel = {key: request.form.get(key) for key in request.form}
    # print(channel)
    count = db_manager.getUnreadMessageCount(channel)
    return jsonify(count)


@app.route('/api/loadthreadmassage', methods=['POST'])
def loadthreadmassage():
    # print("----- calling loadthreadmassage method!")
    thread = {key: request.form.get(key) for key in request.form}
    print(thread)
    messages = db_manager.loadThreadMessage(thread)
    return jsonify(messages)


@app.route('/api/sendthreadmessage', methods=['POST'])
def sendthreadmessage():
    # print("----- calling sendthreadmessage method!")
    message = {key: request.form.get(key) for key in request.form}
    print(message)
    status = db_manager.sendThreadMessage(message)
    return jsonify(status)






@app.route('/api/create', methods=['POST'])
def create ():
    req = request.get_json(force=True)
    url = request.url_root

    user_name = req['name']
    chat_id = str(generate_chat_id())
    session_token = str(generate_session_token())
    magic_key = str(generate_magic_key())

    magic_invite_link = url + 'chat/' + chat_id + '?magic_key=' + magic_key

    ### store the chat info
    chats[chat_id] = {}
    # authorized_users
    chats[chat_id]["authorized_users"] = {}    
    chats[chat_id]["authorized_users"][session_token] = {"username": user_name, 
                                                         "expires": datetime.datetime.now()
                                                                    + datetime.timedelta(hours=6)}
    # magic key
    chats[chat_id]["magic_invite_link"] = magic_invite_link
    # messages
    chats[chat_id]["messages"] = []

    return {
        "chat_id": chat_id,
        "session_token": session_token,
        "magic_invite_link": magic_invite_link
    }

@app.route('/api/authenticate', methods=['POST'])
def authenticate():

    chat_id = request.headers.get("chat_id")
    user_name = request.headers.get("user_name")
    magic_invite_link = request.headers.get("magic_invite_link")

    if chat_id in chats:
        if chats[chat_id]["magic_invite_link"] == magic_invite_link \
           and len(chats[chat_id]["authorized_users"]) < 6:
            session_token = generate_session_token()

            # add to authorized_users
            chats[chat_id]["authorized_users"][session_token] = {"username": user_name, 
                                                                 "expires": datetime.datetime.now()
                                                                            + datetime.timedelta(hours=6)}
            return {"session_token": session_token}, 200
    return "not valid", 400

@app.route('/api/messages', methods=['GET', 'POST'])
def messages():
    # TODO: check if the request body contains a chat_id and valid session token for that chat
    session_token = request.headers.get("session_token")
    chat_id = request.headers.get("chat_id")

    # send message
    if request.method == 'POST':
        if (session_token in chats[chat_id]["authorized_users"]):
            user_name = chats[chat_id]["authorized_users"][session_token]["username"]
            expiration_time = chats[chat_id]["authorized_users"][session_token]["expires"]
            if (datetime.datetime.now() < expiration_time):
                messages = chats[chat_id]["messages"]
                new_message = request.headers.get("message")
                if len(messages) >= 30:
                    del messages[0]
                messages.append(user_name + ": " + new_message)
                return "Message sent", 200
        return "Invalid", 400

    # get message
    if request.method == 'GET':
        if (session_token in chats[chat_id]["authorized_users"]):
            user_name = chats[chat_id]["authorized_users"][session_token]["username"]
            expiration_time = chats[chat_id]["authorized_users"][session_token]["expires"]
            if (datetime.datetime.now() < expiration_time):

                messages = chats[chat_id]["messages"]

                response = {
                    "messages": messages,
                    "magic_invite_link": chats[chat_id]["magic_invite_link"],
                    "user_name": user_name
                    }

                return response, 200
        return "Invalid", 400

if __name__ == '__main__':
    app.run(debug=True)