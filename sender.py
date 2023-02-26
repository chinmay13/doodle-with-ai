from flask import Flask, jsonify, render_template
import random

app = Flask(__name__)

@app.route('/variable')
def variable():
    value = random.randint(0, 100)
    return jsonify({'value': value})


if __name__ == '__main__':
    app.run()
