import json
import os
from datetime import datetime

PRODUCTS_DIR = "../backend/trackers"


def ensure_dir():
    if not os.path.exists(PRODUCTS_DIR):
        os.makedirs(PRODUCTS_DIR)


def save_price_to_json(product_id, product_name, site, price):
    ensure_dir()
    path = os.path.join(PRODUCTS_DIR, f"{product_id}.json")

    data = {"id": product_id, "name": product_name, "site": site, "history": []}

    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)

    record = {"price": price, "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")}

    data["history"].append(record)

    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

    print(f"💾 Actualizado {path}")
