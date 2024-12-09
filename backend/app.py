# app.py
from flask import Flask
from flask_cors import CORS
from flask_session import Session
from config import Config
from utils.db import get_db_connection
from routes.auth import auth_bp
from routes.items import items_bp
from routes.orders import orders_bp
from routes.donations import donations_bp
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
app.config.from_object(Config)
app.secret_key = 'd4b3c1ef84e0a3c7bbd1ea5f0bc2f9c1298dc1c7c7f58bba0a45b5aab0c8e7a2'
Session(app)
CORS(app, supports_credentials=True)

# Register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(items_bp)
app.register_blueprint(orders_bp)
app.register_blueprint(donations_bp)


# Home route
@app.route('/')
def home():
    return "Welcome to WelcomeHome!"

if __name__ == '__main__':
    app.run(debug=True)