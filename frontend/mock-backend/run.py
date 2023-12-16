from flask import Flask, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

@app.route("/",methods=["GET"])
def hello():
    return 'Hello, World'

@app.route('/data', methods=['GET'])
def get_data():
    with open('historical_data.json', 'r') as file:
        data = json.load(file)
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
