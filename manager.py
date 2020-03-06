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
    print("magic_link", magic_link)
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


class dbManager:
    def connectDB(self):
        conn = mysql.connector.connect(user="root", database="belay", password="1liruixi")
        if conn:
            print("success!")
        return conn


    def login(self, uesr):
        return


    def signup(self, user):
        # check validity
        conn = self.connectDB()
        cursor = conn.cursor()
        query = "INSERT INTO users(email, username, password) VALUES(%s, %s, %s)"
        try:
            cursor.execute(query, (user['email'], user['username'], user['password']))
            conn.commit()
            return "Success!"
        except Exception as e:
            print(e)
            return "Fail to signup!"
        finally:
            cursor.close()
            conn.close()


    def getChannels(self):
        conn = self.connectDB()
        cursor = conn.cursor()
        query = "SELECT name from channels"
        try:
            cursor.execute(query)
            channels = cursor.fetchall()
            return channels
        except Exception as e:
            print(e)
            return {"username": username}, 302
        finally:
            cursor.close()
            conn.close()

    def postMessage(self, message):
        conn = self.connectDB()
        cursor = conn.cursor()
        table_name = "channel_" + message["channelName"]
        query = "INSERT INTO {}(email, text, timestamp) VALUES(%s, %s, %s)".format(table_name)
        try:
            timestamp = self.getTime()
            cursor.execute(query, (message['email'], message['message'], timestamp))
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
        table_name = "channel_" + channel["channelName"]

        try:
            if channel["firstLoad"] == "true":
                query = "SELECT u.username, c.id, c.timestamp, c. text FROM {} c LEFT JOIN users u ON c.email = u.email ORDER BY c.id DESC LIMIT 20".format(table_name)
            else:
                firstMessageID = int(channel['firstMessageID'])
                query = "SELECT u.username, c.id, c.timestamp, c. text FROM {} c LEFT JOIN users u ON c.email = u.email WHERE c.id < {} AND c.id > {} - 20 + 1 ORDER BY c.id DESC".format(table_name, firstMessageID, firstMessageID)
                print(query)
            cursor.execute(query)
            messages = cursor.fetchall()
            print(messages)
            return messages
        except Exception as e:
            print(e)
        finally:
            cursor.close()
            conn.close()


    def getMessage(self, channel):
        conn = self.connectDB()
        cursor = conn.cursor()
        table_name = "channel_" + channel["channelName"]
        lastMessageID = int(channel['lastMessageID'])

        query = "SELECT u.username, c.id, c.timestamp, c.text FROM {} c LEFT JOIN users u ON c.email = u.email WHERE c.id > {} ORDER BY c.id DESC".format(table_name, lastMessageID)
        try:
            cursor.execute(query)
            messages = cursor.fetchall()
            return messages
        except Exception as e:
            print(e)
        finally:
            cursor.close()
            conn.close()


    def getTime(self):
        return datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")


