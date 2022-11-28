import os
import psycopg2
import base64
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_httpauth import HTTPBasicAuth, HTTPTokenAuth
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

conn = psycopg2.connect(
        host="localhost",
        port="5432",
        database="postgres",
        user="postgres",
        password="")
# removed postgres password
cur = conn.cursor()

basic_auth = HTTPBasicAuth()
token_auth = HTTPTokenAuth()

@basic_auth.verify_password
def verify(email, password):
    cur.execute('SELECT * FROM users WHERE email=%s', (email,))
    record = cur.fetchone()
    if record is not None and check_password_hash(record[3], password):
        return email

@token_auth.verify_token
def verify(token):
    cur.execute('SELECT * FROM users WHERE token=%s', (token,))
    record = cur.fetchone()
    if record and record[5] > datetime.utcnow():
        return record[2]

def get_token(email, expires_in=3600):
    now = datetime.utcnow()
    cur.execute('SELECT * FROM users WHERE email=%s', (email,))
    record = cur.fetchone()
    user_token = record[4]
    user_token_expiration = record[5]
    if user_token and user_token_expiration > now + timedelta(minutes=1):
        return user_token
    token = base64.b64encode(os.urandom(24)).decode('utf-8')
    token_expiration = now + timedelta(seconds=expires_in)
    
    cur.execute('UPDATE users SET token=%s, token_expiration=%s WHERE email=%s',
        (token, token_expiration, email))
    conn.commit()

    return token

@app.route('/token')
@basic_auth.login_required
def token():
    user = basic_auth.current_user()
    token = get_token(user)
    return jsonify({'token': token})


# Get all posts
@app.route('/', methods=['GET'])
def index():
    cur.execute("select * from form f")
    sql_result = [dict((cur.description[i][0], value) \
                    for i, value in enumerate(row)) for row in cur.fetchall()]
    response = jsonify(sql_result)
    print(response)
    return response

@app.route('/form', methods=['POST'])
@token_auth.login_required
def handle_form():
    print(request)
    data = request.get_json()
    city = data['city']
    specialty = data['specialty']
    wages = data['wages']
    yoe = data['yoe']
    user_id = data['user_id']

    print(city, wages, yoe)

    cur.execute('INSERT INTO form (city, specialty, wages, years_of_experience, user_id)'
                'VALUES (%s, %s, %s, %s, %s)',
                (city, specialty, wages, yoe, user_id))
    conn.commit()

    return jsonify("Success!"), 201

@app.route('/edit_post', methods=['POST'])
@token_auth.login_required
def edit_post_by_id():
    data = request.get_json()
    city = data['city']
    specialty = data['specialty']
    wages = data['wages']
    yoe = data['yoe']
    post_id = data['post_id']

    cur.execute('UPDATE form SET city=%s, specialty=%s, wages=%s, years_of_experience=%s WHERE id=%s',
    (city, specialty, wages, yoe, post_id))
    conn.commit()

    return jsonify("Success!"), 201

@app.route('/delete_post', methods=['DELETE'])
@token_auth.login_required
def delete_post_by_id():
    data = request.get_json()
    post_id = data['post_id']
    print(post_id)
    cur.execute('DELETE FROM form WHERE id=%s', 
        (post_id,))
    conn.commit()
    
    return jsonify("Post deleted"), 201

@app.route('/user_posts', methods=['POST'])
@token_auth.login_required
def user_posts():
    data = request.get_json()
    user_id = data['user_id']
    
    cur.execute('SELECT * FROM form WHERE user_id=%s', 
        (user_id,))

    posts = [dict((cur.description[i][0], value) 
        for i, value in enumerate(row)) for row in cur.fetchall()]
    
    return jsonify(posts), 201

@app.route('/create_user', methods=['POST'])
def create_user():
    print(request)
    data = request.get_json()
    full_name = data['full_name']
    email = data['email']
    password = generate_password_hash(data['password'])
    print(full_name, email)

    cur.execute('SELECT * FROM users WHERE email=%s',
                (email,))

    if cur.fetchone():
        return jsonify("This email is already taken, please try another."), 400

    token = base64.b64encode(os.urandom(24)).decode('utf-8')
    token_expiration = datetime.utcnow() + timedelta(seconds=3600)
    cur.execute('INSERT INTO users (full_name, email, password, token, token_expiration)'
                'VALUES (%s, %s, %s, %s, %s)',
                (full_name, email, password, token, token_expiration))
    conn.commit()

    return jsonify("User successfully created!"), 201

@app.route('/login', methods=['POST'])
def login():
    print(request)
    data = request.get_json()
    email = data['email']
    password = data['password']

    cur.execute('SELECT * FROM users WHERE email=%s',
                (email,))
    record = cur.fetchone()
    print(record)

    if not record:
        return jsonify("There is no user with this email"), 400

    get_token(email)

    cur.execute('SELECT * FROM users WHERE email=%s',
            (email,))

    record = cur.fetchone()

    user_info = dict((cur.description[i][0], value) \
        for i, value in enumerate(record))
    print(user_info)
    return jsonify(user_info), 201


app.run()