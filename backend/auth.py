from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
import sqlite3

auth_bp = Blueprint('auth', __name__)
bcrypt = Bcrypt()

def get_db():
    conn = sqlite3.connect('db.sqlite3')
    conn.row_factory = sqlite3.Row
    return conn

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data['username']
    password = data['password']

    conn = get_db()
    cur = conn.cursor()

    # Check if user exists
    cur.execute("SELECT * FROM users WHERE username = ?", (username,))
    existing_user = cur.fetchone()

    if existing_user:
        return jsonify({'message': 'Username already exists'}), 400

    # Hash password and insert
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    cur.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, hashed_password))
    conn.commit()

    return jsonify({'message': 'User registered successfully'}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data['username']
    password = data['password']

    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE username = ?", (username,))
    user = cur.fetchone()

    if user and bcrypt.check_password_hash(user['password'], password):
        return jsonify({'message': 'Login successful', 'user_id': user['id']})
    return jsonify({'message': 'Invalid credentials'}), 401
