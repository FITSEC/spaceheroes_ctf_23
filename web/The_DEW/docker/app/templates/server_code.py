#https://www.w3schools.com/howto/howto_css_blog_layout.asp
#https://flask.palletsprojects.com/en/latest/patterns/fileuploads/
import os
import redis
import subprocess
from uuid import uuid4
from flask import *
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_socketio import SocketIO, emit
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = os.path.abspath('../') + '/images/'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

app = Flask(__name__)

limiter = Limiter(
	get_remote_address,
	app=app,
	default_limits=["30 per minute"]
)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['SECRET_KEY'] = 'secret!'

socketio = SocketIO(app)

comments = []

def allowed_file(filename):
   return '.' in filename and filename.rsplit('.')[1].lower() in ALLOWED_EXTENSIONS

@app.after_request
def add_security_headers(resp):
	resp.headers['Content-Security-Policy']="default-src 'self' https://*.jquery.com https://*.cloudflare.com;  object-src 'none';"
	return resp

@socketio.on('submit comment')
def handle_comment(data):
	comments.append("<p class=\"comment\"><strong>" + data['author'] + ":</strong> " + data['comment'] + "</p>");
	emit('new comment', broadcast=True)

@socketio.on('waive admin')
def waive_admin():
	subprocess.run(['python','admin.py'])

@app.route('/', methods=['GET'])
def news():
	if 'flag' in request.cookies:
		return render_template('/news.html', comments=comments)
	else:
		resp = make_response(render_template('/news.html', comments=comments))
		resp.set_cookie('flag','if only you were the admin lol')
		return resp

@app.route('/upload', methods=['GET','POST'])
def upload():
	if request.method == 'POST':
		if 'file' not in request.files:
			flash('No file part')
			return render_template('/upload.html',message='No file uploaded :(')
		file = request.files['file']
		if not file:
			flash('No file data')
			return render_template('/upload.html',message='No file uploaded :(')
		if file.filename == '':
			flash('No selected file')
			return render_template('/upload.html',message='Filename can\'t be empty, silly!')
		if allowed_file(file.filename):
			filename = session['uuid'] + secure_filename(file.filename)
			print(filename)
			file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
			return render_template('/upload.html',message=f'Image uploaded successfully to /images/{filename}!')
		else:
			return render_template('/upload.html',message='Bad file type detected! Only .png, .jpg, .jpeg, and .gif allowed!')
	return render_template('/upload.html')

@app.route('/images/<name>', methods=['GET'])
def download_file(name):
	return send_from_directory(app.config["UPLOAD_FOLDER"], name)


@app.route('/source',methods=['GET'])
def show_source():
	return render_template('server_code.py')

if __name__=='__main__':
	app.run(host="0.0.0.0",port=31337)
