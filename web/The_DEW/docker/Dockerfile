FROM debian:bullseye

RUN apt-get update -y
RUN apt-get upgrade -y

RUN apt-get update -y && apt-get install -y python3 python3-pip sqlite3 redis python-is-python3 chromium
RUN python3 -m pip install flask flask_socketio flask_limiter flask_sqlalchemy flask_session redis \
    werkzeug selenium webdriver-manager gevent-websocket eventlet==0.30.2 gunicorn

ADD /app /app

CMD chmod +x /app/start.sh

RUN useradd -m web; chown -R web /app
EXPOSE 31337/TCP
WORKDIR /app
ENTRYPOINT ["bash", "start.sh"]
