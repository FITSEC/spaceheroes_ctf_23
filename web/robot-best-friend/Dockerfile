FROM python:3.9
RUN pip install flask waitress openai
COPY static /app/static
COPY templates /app/templates
COPY Chall.py /app
WORKDIR /app
EXPOSE 8080/tcp
CMD waitress-serve Chall:app



