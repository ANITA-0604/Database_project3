from flask import Blueprint, request, jsonify
from utils.db import get_db_connection
from utils.security import hash_password
import jwt
import datetime
from functools import wraps
import uuid
auth_bp = Blueprint('auth', __name__, url_prefix='/auth')
SECRET_KEY = "your_secret_key"  

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            token = token.split(" ")[1] 
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            request.user = data  
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token!'}), 401

        return f(*args, **kwargs)
    return decorated


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    fname = data.get('fname')
    lname = data.get('lname')
    email = data.get('email')

    role = data.get('role', 'user')
    if not username or not password:
        return {'message': 'Username and password are required'}, 400

    salt = uuid.uuid4().hex
    hashed_password = hash_password(password, salt)
    connection = get_db_connection()
    print(role)
    if role == "Staff":
        role = 2
    else:
        role = 1
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT userName FROM Person WHERE userName = %s", (username,))
            if cursor.fetchone():
                return {'message': 'Username already exists'}, 400
            cursor.execute("""
                INSERT INTO Person (userName, password, fname, lname, email, salt)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (username, hashed_password, fname, lname, email, salt))
            
            cursor.execute("""
                INSERT INTO Act ( userName, roleID)
                VALUES(%s, %s)
            """, (username, role))
            connection.commit()

        return {'message': 'User registered successfully'}, 201
    except Exception as e:
        return {'message': f'Error: {str(e)}'}, 500
    finally:
        connection.close()

# 登录用户并生成 JWT
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return {'message': 'Username and password are required'}, 400

    connection = get_db_connection()
    with connection.cursor() as cursor:
        cursor.execute("SELECT * FROM Person WHERE userName = %s", (username,))
        user = cursor.fetchone()

    if user and user['password'] == hash_password(password, user['salt']):
        token = jwt.encode(
            {
                "userName": user['userName'],
                "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
            },
            SECRET_KEY,
            algorithm="HS256"
        )
        return jsonify({'message': 'Login successful', 'token': token}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401

# 检查会话状态
@auth_bp.route('/session-info', methods=['GET'])
@token_required
def session_info():
    return jsonify({'loggedIn': True, 'username': request.user['userName']})


