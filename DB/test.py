import pymysql
from pymysql.err import OperationalError

def execute_query(query):
    try:
        connection = pymysql.connect(
            host='127.0.0.1',
            user='root',
            password='root',
            database='welcome_home',
            port=8889
        )
        with connection.cursor() as cursor:
            cursor.execute(query)
            return cursor.fetchall()
        connection.close()
    except OperationalError as e:
        print("OperationalError:", e)
        # Handle reconnection logic here
        return None
        

execute_query("Asd")