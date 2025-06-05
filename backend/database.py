import psycopg2
from psycopg2.extras import RealDictCursor

class PostgresHandler:
    def __init__(self, host, user, password, database, port=5432):
        self.conn = psycopg2.connect(
            host=host,
            user=user,
            password=password,
            dbname=database,
            port=port
        )
        self.conn.autocommit = True

    def execute(self, query, params=None):
        with self.conn.cursor() as cursor:
            cursor.execute(query, params)

    def fetchall(self, query, params=None):
        with self.conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(query, params)
            return cursor.fetchall()

    def fetchone(self, query, params=None):
        with self.conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(query, params)
            return cursor.fetchone()

    def close(self):
        self.conn.close()
