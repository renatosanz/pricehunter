import sqlite3
from datetime import datetime

class DatabaseConnection:
    def __init__(self, db_path="db.sqlite"):
        self.db_path = db_path

    def connect(self):
        return sqlite3.connect(self.db_path)

    def get_active_products(self):
        conn = self.connect()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, name, link, platform, traceInterval, sms_enabled, email_enabled
            FROM tracker
            WHERE active = 1
        """)
        products = cursor.fetchall()
        conn.close()
        result = []
        for row in products:
            result.append({
                "id": row[0],
                "name": row[1],
                "link": row[2],
                "platform": row[3],
                "traceInterval": row[4],
                "sms_enabled": row[5],
                "email_enabled": row[6]
            })
        return result

    def insert_price_history(self, product_id, price, site):
        conn = self.connect()
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS price_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_id INTEGER,
                price TEXT,
                site TEXT,
                timestamp TEXT
            )
        """)
        conn.commit()
        cursor.execute("""
            INSERT INTO price_history (product_id, price, site, timestamp)
            VALUES (?, ?, ?, ?)
        """, (product_id, price, site, datetime.now().strftime("%Y-%m-%d %H:%M:%S")))
        conn.commit()
        conn.close()
