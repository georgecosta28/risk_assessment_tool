import sqlite3

conn = sqlite3.connect('db.sqlite3')
c = conn.cursor()

c.execute('''CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
)''')

c.execute('''CREATE TABLE IF NOT EXISTS companies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    industry TEXT,
    size TEXT,
    user_id INTEGER
)''')

c.execute('''CREATE TABLE IF NOT EXISTS assessments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    company_id INTEGER,
    answers TEXT,
    risk_score INTEGER,
    created_at TEXT
)''')

conn.commit()
conn.close()
