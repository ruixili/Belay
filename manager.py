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