su -c "redis-server &
gunicorn -k eventlet --access-logfile - -b 0.0.0.0:31337 --thread 50 server:app" web
