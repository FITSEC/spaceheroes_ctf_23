from flask import Flask, render_template, request, make_response

import os, subprocess

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html', message='Welcome to page one of Sanity Check in space!', 
image_url='/static/robot.JPG')

@app.route('/robots.txt')
def robots():
    return "Welcome to page two of Sanity Check in space, here's some robots.txt stuff. User-agent: *\nDisallow: humans.txt/"

@app.route('/humans.txt')
def humans():
    human = request.cookies.get('human')
    if human == 'true':
        message = "Wow, you really are human, celebrate with us by visiting arrakis"
    else:
        message = "Welcome fellow human to page three of Sanity Check in space! You look pretty human, but we have to be sure. Go eat something and come back here."
        response = make_response(render_template('humans.html', message=message))
        response.set_cookie('human', 'false')
        return response
    return render_template('humans.html', message=message)


@app.route('/arrakis', methods=['GET', 'POST'])
def arrakis():
    password = 'FearIsTheMindKiller'
    if request.method == 'POST':
        user_password = request.form['password']
        if user_password == password:
            message = "Excellent job, one ultimate challenge awaits you, on krypton"
            return render_template('arrakis.html', message=message)
        else:
            error = "You can't just go around guessing passwords, this isn't an OSINT challenge."
            return render_template('arrakis.html', error=error)
    else:
        message = "Welcome Master Jedi to page four of Sanity Check in Space. We want to party, but this place is password protected, so we might as well give up."
        return render_template('arrakis.html', message=message)

@app.route('/krypton', methods=['GET', 'POST'])
def ping():
    if request.method == 'POST':
        website = request.form['website']
        try:
            result = 'ping -c 1 ' + website
            output = os.popen(result).read()
            return render_template('krypton.html', output=output)
        except:
            error = "Unable Space Ping the website. Try harder, or fix your input."
            return render_template('krypton.html', error=error)

    return render_template('krypton.html')

@app.route('/admin')
def admin():
    return render_template('admin.html')

app.run(debug=False, port=31337)
