from flask import Flask, render_template, request, send_file, jsonify, abort
import random
import os

app = Flask(__name__)

# Flag Open
result = 'cat flag.txt'
output = os.popen(result).read()

@app.route('/')
def index():
    #return render_template('agc.html', ctf_flag=output)
    return render_template('agc.html')

@app.route('/checklist.html')
def checklist():
    return render_template('checklist.html')

@app.route('/profile.json')
def profile():
    return app.send_static_file('profile.json')

@app.route("/get_parameter")
def get_parameter():
    return jsonify({"parameter": "testing_parameter"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5932)

