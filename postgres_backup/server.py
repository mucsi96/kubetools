from functools import reduce
import boto3

from boto3.exceptions import S3UploadFailedError
from botocore.exceptions import ClientError
from datetime import datetime
from os import getenv, remove
from subprocess import run
from flask import Flask, jsonify, g, request
from psycopg import connect, Connection

app = Flask(__name__)
s3_client = boto3.client('s3',
                         endpoint_url=getenv("DB_BACKUP_ENDPOINT_URL"),
                         aws_access_key_id=getenv("DB_BACKUP_ACCESS_KEY_ID"),
                         aws_secret_access_key=getenv(
                             "DB_BACKUP_SECRET_ACCESS_KEY")
                         )
s3_bucket = getenv("DB_BACKUP_BUCKET")


def sizeof_fmt(num, suffix="B"):
    for unit in ["", "Ki", "Mi", "Gi", "Ti", "Pi", "Ei", "Zi"]:
        if abs(num) < 1024.0:
            return f"{num:3.1f}{unit}{suffix}"
        num /= 1024.0
    return f"{num:.1f}Yi{suffix}"


def get_conn_str() -> str:
    user = getenv("POSTGRES_USER")
    password = getenv("POSTGRES_PASSWORD")
    host = getenv("POSTGRES_HOSTNAME")
    port = getenv("POSTGRES_PORT")
    db = getenv("POSTGRES_DB")

    return f'postgresql://{user}:{password}@{host}:{port}/{db}'


def get_db() -> Connection:
    conn = getattr(g, '_db_conn', None)

    if (conn is None):
        conn = connect(get_conn_str())
        g._db_conn = conn

    return conn


def get_count(table: str) -> int:
    with get_db().cursor() as cursor:
        cursor.execute(f'SELECT COUNT(*) FROM {table}')
        return cursor.fetchone()[0]


def safe_upload_backup(filename: str):
    try:
        upload_backup(filename)
    except S3UploadFailedError:
        s3_client.create_bucket(Bucket=s3_bucket)
        upload_backup(filename)


def upload_backup(filename: str):
    s3_client.upload_file(
        Filename=filename, Bucket=s3_bucket, Key=filename)


def get_tables_info():
    with get_db().cursor() as cursor:
        cursor.execute(
            "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
        tables = list(map(lambda row: {
            'name': row[0],
            'count': get_count(row[0])
        }, cursor.fetchall()))
        total_count = reduce(lambda acc, table: acc +
                             table['count'], tables, 0)
        return {
            'tables': tables,
            'total_count': total_count
        }


@app.route('/', methods=['GET'])
def main():
    return app.send_static_file('index.html')


@app.route('/tables', methods=['GET'])
def get_tables():
    return jsonify(get_tables_info())


@app.route('/backups', methods=['GET'])
def get_backups():
    try:
        backups = sorted(s3_client.list_objects_v2(Bucket=s3_bucket)[
                         'Contents'], key=lambda bucket: int(bucket['LastModified'].strftime('%s')), reverse=True)
        return jsonify(list(map(lambda bucket: {
            'name': bucket['Key'],
            'last_modified': bucket['LastModified'].isoformat(),
            'size': sizeof_fmt(bucket['Size']),
            'total_count': get_total_count_from_name(bucket),
            'retention_period': get_retention_period_from_name(bucket)
        }, backups)))
    except ClientError as err:
        if err.response['Error']['Code'] == 'NoSuchBucket':
            return jsonify([])
        raise


def get_total_count_from_name(bucket):
    try:
        return int(bucket['Key'].split(".")[1])
    except:
        return 0


def get_retention_period_from_name(bucket):
    try:
        return int(bucket['Key'].split(".")[2])
    except:
        return 0


@app.route('/backup', methods=['POST'])
def backup():
    raw_retention_period = request.args.get("retention_period")
    assert raw_retention_period != None
    retention_period = int(raw_retention_period)
    assert retention_period > 0
    assert retention_period <= 356
    total_count = get_tables_info()['total_count']
    timestr = datetime.now().strftime('%Y%m%d-%H%M%S')
    filename = '{}.{}.{}.pgdump'.format(timestr, total_count, retention_period)
    run(['pg_dump', '--dbname', get_conn_str(),
        '--format', 'c', '--file', filename])
    safe_upload_backup(filename)
    remove(filename)
    return jsonify('ok')


@app.route('/restore/<key>', methods=['POST'])
def restore(key: str):
    print(key)
    s3_client.download_file(Filename=key, Bucket=s3_bucket, Key=key)
    run(['pg_restore', '--clean', '--dbname', get_conn_str(),
        '--verbose', key])
    remove(key)
    return jsonify('ok')


@app.teardown_appcontext
def close_connection(exception):
    conn = getattr(g, '_db_conn', None)

    if conn is not None:
        conn.close()


if __name__ == '__main__':
    app.run()
