from os import getenv
from subprocess import run
from flask import Flask, redirect, render_template, g
from psycopg import connect, Connection

app = Flask(__name__)


def get_db() -> Connection:
    conn = getattr(g, '_db_conn', None)

    if (conn is None):
        user = getenv("POSTGRES_USER")
        password = getenv("POSTGRES_PASSWORD")
        host = getenv("POSTGRES_HOSTNAME")
        port = getenv("POSTGRES_PORT")
        db = getenv("POSTGRES_DB")

        conn = connect(f'postgresql://{user}:{password}@{host}:{port}/{db}')
        g._db_conn = conn
    
    return conn
    


def get_count(table: str) -> int:
    with get_db().cursor() as cursor:
        cursor.execute(f'SELECT COUNT(*) FROM {table}')
        return cursor.fetchone()[0]

def get_tables():
    with get_db().cursor() as cursor:
        cursor.execute(
            "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
        return list(map(lambda row: {'name': row[0], 'count': get_count(row[0])}, cursor.fetchall()))


@app.route('/')
def main():
    return render_template('index.html', tables=get_tables())

@app.route('/backup', methods=['POST'])
def backup():
    return redirect('/');

@app.teardown_appcontext
def close_connection(exception):
    conn = getattr(g, '_db_conn', None)

    if conn is not None:
        conn.close()

if __name__ == '__main__':
    app.run()
