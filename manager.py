import mysql.connector
import datetime
import bcrypt

DB_NAME = 'belay'
DB_USERNAME = "root"
DB_PASSWORD = "123456"


class dbManager:
    def connectDB(self):
        conn = mysql.connector.connect(user="root", database="belay", password="1liruixi")
        if conn:
            print("success!")
        return conn

    def getChannels(self):
        channels = []
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

    def getTime(self):
        return datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")


