from flask import Flask, render_template, request, jsonify
from functools import wraps
import string
import random
import datetime
import manager

app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
db_manager = manager.dbManager()

chats = {}

# helper functions
session_tokens = set()
def generate_session_token():
    session_token =  ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(6))
    while (session_token in session_tokens):
        session_token =  ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(6))
    
    return session_token

magic_keys = set()
def generate_magic_key():
    magic_key =  ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(12))
    while (magic_key in magic_keys):
        magic_key =  ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(12))
    
    return magic_key

def generate_chat_id():
    chat_id = ''.join(random.choice(string.digits) for _ in range(6))
    while (chat_id in chats):
        chat_id = ''.join(random.choice(string.digits) for _ in range(6))
    
    return chat_id


@app.route('/')
@app.route('/changepassword')
def index(chat_id=None):
    return app.send_static_file('index.html')

# -------------------------------- API ROUTES ----------------------------------

@app.route('/api/login', methods=['POST'])
def login ():
    print("----- calling login method!")
    user = {key: request.form.get(key) for key in request.form}
    print(user)

    if(user["email"] == "rxli@uchicago.edu" and user["password"] == "123456"):
        return {"session_token": "12345"}

    return {}, 403

@app.route('/api/getchannels', methods=['POST'])
def getchannels ():
    print("----- calling getchannels method!")
    user = {key: request.form.get(key) for key in request.form}
    print(user)

    channels = db_manager.getChannels()
    print(channels)
    return jsonify(channels)


@app.route('/api/moremessage', methods=['POST'])
def moremessage():
    print("----- calling moremessage method!")
    channel = {key: request.form.get(key) for key in request.form}
    print(channel)

    return jsonify("")


@app.route('/api/postmessage', methods=['POST'])
def postmessage():
    print("----- calling postmessage method!")
    message = {key: request.form.get(key) for key in request.form}
    print(message)
    result = db_manager.postMessage(message)
    return result



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