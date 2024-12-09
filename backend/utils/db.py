# utils/db.py
import pymysql
from config import Config

def get_db_connection():
    connection = pymysql.connect(
        host=Config.MYSQL_HOST,
        port=8889,
        user=Config.MYSQL_USER,
        password=Config.MYSQL_PASSWORD,
        db=Config.MYSQL_DB,
        cursorclass=pymysql.cursors.DictCursor
    )
    return connection
