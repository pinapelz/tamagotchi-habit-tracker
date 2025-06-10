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
        self.conn.autocommit = False

    def execute(self, query, params=None):
        with self.conn.cursor() as cursor:
            try:
                cursor.execute(query, params)
                self.conn.commit()
            except Exception as e:
                self.conn.rollback()
                raise e

    def fetchall(self, query, params=None):
        with self.conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(query, params)
            return cursor.fetchall()

    def fetchone(self, query, params=None):
        with self.conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(query, params)
            return cursor.fetchone()

    def close(self):
        if self.conn:
            self.conn.close()

    def commit(self):
        self.conn.commit()
