# https://www.w3schools.com/howto/howto_css_blog_layout.asp
# https://flask.palletsprojects.com/en/latest/patterns/fileuploads/
import os
import redis
import subprocess
from uuid import uuid4
from flask import *
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_socketio import SocketIO, emit
from flask_sqlalchemy import SQLAlchemy
from flask_session import Session
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = os.path.abspath('./') + '/images/'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
db_name = 'blog_comments.db'

app = Flask(__name__)

limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["30 per minute"]
)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['SECRET_KEY'] = uuid4().hex

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + db_name
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

app.config['SESSION_TYPE'] = 'redis'
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_USE_SIGNER'] = True
app.config['SESSION_REDIS'] = redis.from_url('redis://localhost:6379')

socketio = SocketIO(app)
db = SQLAlchemy(app)
server_session = Session(app)


with open("templates/server_code.py",'r') as inf:
    source = inf.read()
    

class Comment(db.Model):
    __tablename__ = 'comments'
    id = db.Column(db.Integer, primary_key=True)
    uuid = db.Column(db.String)
    author = db.Column(db.String)
    comment = db.Column(db.String)

    def __init__(self, uuid, author, comment):
        self.uuid = uuid
        self.author = author
        self.comment = comment


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.')[1].lower() in ALLOWED_EXTENSIONS


@app.after_request
def add_security_headers(resp):
    resp.headers[
        'Content-Security-Policy'] = "default-src 'self' https://*.jquery.com https://*.cloudflare.com;  object-src 'none';"
    return resp


@socketio.on('submit comment')
def handle_comment(data):
    new_record = Comment(session['uuid'], data['author'], data['comment'])
    db.session.add(new_record)
    db.session.commit()
    emit('new comment', broadcast=True)


@socketio.on('waive admin')
def waive_admin():
    session_cookie = request.cookies.get('session')
    subprocess.run(['python', 'admin.py', f'{session_cookie}'])


@app.route('/', methods=['GET'])
def news():
    if not session.get('uuid'):
        session['uuid'] = str(uuid4())
    comments = Comment.query.filter_by(uuid=session['uuid']).order_by(Comment.id).all()
    comment_list = []
    for comment in comments:
        comment_list.append("<p class=\"comment\"><strong>" + comment.author + ":</strong> " + comment.comment + "</p>")
    if 'flag' in request.cookies:
        return render_template('/news.html', comments=comment_list)
    else:
        resp = make_response(render_template('/news.html', comments=comment_list))
        resp.set_cookie('flag', 'if only you were the admin lol')
        return resp


@app.route('/upload', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        if 'file' not in request.files:
            flash('No file part')
            return render_template('/upload.html', message='No file uploaded :(')
        file = request.files['file']
        if not file:
            flash('No file data')
            return render_template('/upload.html', message='No file uploaded :(')
        if file.filename == '':
            flash('No selected file')
            return render_template('/upload.html', message='Filename can\'t be empty, silly!')
        if allowed_file(file.filename):
            filename = session['uuid'] + secure_filename(file.filename)
            print(filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            return render_template('/upload.html', message=f'Image uploaded successfully to /images/{filename}!')
        else:
            return render_template('/upload.html',
                                   message='Bad file type detected! Only .png, .jpg, .jpeg, and .gif allowed!')
    return render_template('/upload.html')


@app.route('/images/<name>', methods=['GET'])
def download_file(name):
    return send_from_directory(app.config["UPLOAD_FOLDER"], name)


@app.route('/source', methods=['GET'])
def show_source():
    response = make_response(source,200)
    response.mimetype = "text/plain"
    return response


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=31337)
