from flask import Blueprint, request, jsonify
import sqlite3

company_bp = Blueprint('company', __name__)

def get_db():
    conn = sqlite3.connect('db.sqlite3')
    conn.row_factory = sqlite3.Row
    return conn

@company_bp.route('/companies', methods=['POST'])
def add_company():
    data = request.json
    name = data['name']
    industry = data['industry']
    size = data['size']
    user_id = data['user_id']

    conn = get_db()
    cur = conn.cursor()
    cur.execute("INSERT INTO companies (name, industry, size, user_id) VALUES (?, ?, ?, ?)",
                (name, industry, size, user_id))
    conn.commit()
    return jsonify({'message': 'Company added successfully'})

@company_bp.route('/companies/<int:user_id>', methods=['GET'])
def get_companies(user_id):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM companies WHERE user_id = ?", (user_id,))
    companies = [dict(row) for row in cur.fetchall()]
    return jsonify(companies)
