import mysql.connector
import datetime
import bcrypt

import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail


def forgetPassword(user):
    # check if email exists?

    # need to change into token
    magic_link = user['url'] + 'forgetpassword?magic=' + user['email']
    message = Mail(
        from_email='admin@belay.com',
        to_emails=user['email'],
        subject='Reseting your Belay password',
        html_content='Click this link to reset your password <strong>{}</strong>!'.format(magic_link))
    try:
        sg = SendGridAPIClient(os.environ.get('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'))
        response = sg.send(message)
        return "Link sent to your mailbox!"
    except Exception as e:
        print(str(e))
        return "Unable to send email!"

def hashPassword(user):
    salt = bcrypt.gensalt(9)
    hashed = bcrypt.hashpw(user['password'].encode('utf-8'), salt)
    user['password'] = hashed
    return user


class dbManager:
    def connectDB(self):
        conn = mysql.connector.connect(user="root", database="belay", password="1liruixi")
        # if conn:
        #     print("Connected to database!")
        return conn


    def login(self, user):
        conn = self.connectDB()
        cursor = conn.cursor()
        print(user)
        query = "SELECT * FROM users WHERE email = (%s)"
        try:
            cursor.execute(query, (user['email'],))
            data = cursor.fetchall()
            # print(data)
            # print(len(data))
            # print(user['password'].encode('utf-8'))
            # print(data[0][2])
            success = bcrypt.checkpw(user['password'].encode('utf-8'), data[0][2])
            if len(data) == 1 and success:
                # print("It's true!")
                return True
        except Exception as e:
            print(e)
        finally:
            cursor.close()
            conn.close()
        return True # initializer for ctype 'void *' must be a cdata pointer, not bytearray


    def signup(self, user):
        # check validity
        user = hashPassword(user)
        conn = self.connectDB()
        cursor = conn.cursor()
        query = "INSERT INTO users(email, username, password, timestamp) VALUES(%s, %s, %s, %s)"
        try:
            timestamp = self.getTime()
            cursor.execute(query, (user['email'], user['username'], user['password'], timestamp))
            conn.commit()
            return "Success!"
        except Exception as e:
            print(e)
            return "Fail to signup!"
        finally:
            cursor.close()
            conn.close()


    def changePassword(self, user):
        # print(user)
        user = hashPassword(user)
        # print(user)
        conn = self.connectDB()
        cursor = conn.cursor()
        query = "UPDATE users SET password = %s WHERE email = %s"
        try:
            cursor.execute(query, (user['password'], user['email']))
            conn.commit()
            return "Success!"
        except Exception as e:
            print(e)
            return "Fail to change password!"
        finally:
            cursor.close()
            conn.close()


    def getChannels(self):
        conn = self.connectDB()
        cursor = conn.cursor()
        query = "SELECT channelname FROM channels"
        try:
            cursor.execute(query)
            channels = cursor.fetchall()
            return channels
        except Exception as e:
            print(e)
            return "Fail to fetch channels!"
        finally:
            cursor.close()
            conn.close()


    def createChannel(self, channel):
        # check validity
        conn = self.connectDB()
        cursor = conn.cursor()
        query = "INSERT INTO channels(channelname, timestamp) VALUES(%s, %s)"
        try:
            timestamp = self.getTime()
            cursor.execute(query, (channel['channelName'], timestamp))
            conn.commit()
            return "Success!"
        except Exception as e:
            print(e)
            return "Fail to create new channel!"
        finally:
            cursor.close()
            conn.close()


    def postMessage(self, message):
        conn = self.connectDB()
        cursor = conn.cursor()
        query = "INSERT INTO messages(email, channelname, text, timestamp) VALUES(%s, %s, %s, %s)"
        try:
            timestamp = self.getTime()
            cursor.execute(query, (message['email'], message["channelName"], message['message'], timestamp))
            conn.commit()
            return "Success!"
        except Exception as e:
            print(e)
            return "Fail to send!"
        finally:
            cursor.close()
            conn.close()


    def moreMessage(self, channel):
        print("User want to load more message")
        print(channel)
        conn = self.connectDB()
        cursor = conn.cursor()

        try:
            if channel["firstLoad"] == "true":
                query = "SELECT u.username, m.id, m.timestamp, m.text FROM messages m LEFT JOIN users u ON m.email = u.email WHERE m.channelname = (%s) AND m.replyid IS NULL ORDER BY m.id DESC LIMIT 20"
                cursor.execute(query, (channel["channelName"],))
            else:
                query = "SELECT u.username, m.id, m.timestamp, m.text FROM messages m LEFT JOIN users u ON m.email = u.email WHERE m.channelname = (%s) AND m.replyid IS NULL AND m.id < (%s) AND m.id > (%s) - 20 + 1 ORDER BY m.id DESC"
                cursor.execute(query, (channel["channelName"], channel['firstMessageID'], channel['firstMessageID']))
                print(query)
            messages = {"content":cursor.fetchall()}
            print(messages)

            # get message count
            query = "SELECT replyid, COUNT(*) AS cnt FROM messages WHERE channelname = (%s) GROUP BY replyid"
            cursor.execute(query, (channel["channelName"],))
            count = cursor.fetchall()
            print(count)
            messages["count"] = count

            print("message from moremessage api", messages)
            return messages
        except Exception as e:
            print(e)
        finally:
            cursor.close()
            conn.close()


    def getMessage(self, channel):
        conn = self.connectDB()
        cursor = conn.cursor()
        query = "SELECT u.username, m.id, m.timestamp, m.text FROM messages m LEFT JOIN users u ON m.email = u.email WHERE m.channelname = (%s) AND m.replyid IS NULL AND m.id > (%s) ORDER BY m.id DESC"
        try:
            cursor.execute(query, (channel["channelName"],channel['lastMessageID']))
            messages = cursor.fetchall()
            print(messages)
            return messages
        except Exception as e:
            print(e)
        finally:
            cursor.close()
            conn.close()


    def getUnreadMessageCount(self, channel):
        print("calling getUnreadMessageCount")
        conn = self.connectDB()
        cursor = conn.cursor()
        query = "SELECT COUNT(*) FROM messages m LEFT JOIN users u ON m.email = u.email WHERE m.channelname = (%s) AND m.id > (%s)"
        try:
            print(channel["channelName"], channel['lastMessageID'])
            cursor.execute(query, (channel["channelName"], channel['lastMessageID']))
            count = cursor.fetchone()[0]
            print("Unread for :" + channel["channelName"], count)
            return count
        except Exception as e:
            print(e)
        finally:
            cursor.close()
            conn.close()


    def loadThreadMessage(self, thread):
        conn = self.connectDB()
        cursor = conn.cursor()
        query = "SELECT u.username, m.id, m.timestamp, m.text AS replyCount FROM messages m LEFT JOIN users u ON m.email = u.email WHERE m.replyId = (%s) ORDER BY m.id DESC"
        try:
            cursor.execute(query, (thread['threadMessageID'], ))
            messages = cursor.fetchall()
            print(messages)
            return messages
        except Exception as e:
            print(e)
        finally:
            cursor.close()
            conn.close()


    def sendThreadMessage(self, message):
        conn = self.connectDB()
        cursor = conn.cursor()
        query = "INSERT INTO messages(email, channelname, text, timestamp, replyid) VALUES(%s, %s, %s, %s, %s)"
        try:
            timestamp = self.getTime()
            cursor.execute(query, (message['email'], message["channelName"], message['message'], timestamp, message['replyid']))
            conn.commit()
            return "Success!"
        except Exception as e:
            print(e)
            return "Fail to send!"
        finally:
            cursor.close()
            conn.close()


    def getTime(self):
        return datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")


