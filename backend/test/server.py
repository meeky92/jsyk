from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/singlepost', methods=['GET'])
def post():
    return jsonify({
        'id': 14,
        'location': 'Chicago',
        'specialty': 'ICU',
        'yoe': '5',
        'yoe_facility': '2',
        'pay': 35,
        'user_id': 1
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=105)