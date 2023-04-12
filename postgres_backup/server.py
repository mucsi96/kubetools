from os import getenv
from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'hello world'

if __name__ == '__main__':
    port = int(getenv('PORT', 8080))
    app.run(port=port)