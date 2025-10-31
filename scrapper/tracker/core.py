import time

import schedule

from tracker.database import DatabaseConnection
from tracker.notifier import Notifier
from tracker.scraper import PriceScraper
from tracker.utils import save_price_to_json


class PriceTrackerCore:
    def __init__(self, db_path="tracker.sqlite"):
        self.scraper = PriceScraper()
        self.db = DatabaseConnection(db_path)
        self.notifier = Notifier()
        self.scheduled_products = set()  # Para trackear productos ya programados

    def track_product(self, product):
        print(f"🔍 Rastreo de '{product['name']}' en {product['link']}")
        try:
            name, price, site = self.scraper.get_price_and_name(product["link"])
            save_price_to_json(product["id"], name, site, price)
            self.db.insert_price_history(product["id"], price, site)

            msg = (
                f"📦 {name}\n💲 Nuevo precio: {price}\n🌐 {site}\n🔗 {product['link']}"
            )

            if product.get("email_enabled"):
                self.notifier.send_email(
                    "tu_correo@gmail.com", f"Bajada de precio: {name}", msg
                )
            if product.get("sms_enabled"):
                self.notifier.send_sms("+521234567890", msg)

            self.notifier.send_telegram(msg)
            print(f"✅ Guardado {name} - {price}")
        except Exception as e:
            print(f"⚠️ Error rastreando {product['name']}: {e}")

    def check_new_products(self):
        """Verifica y programa nuevos productos de la base de datos"""
        products = self.db.get_active_products()
        if not products:
            print("⚠️ No hay productos activos en la base de datos.")
            return

        new_products_count = 0
        for product in products:
            product_id = product["id"]

            # Si el producto no está programado, lo programamos
            if product_id not in self.scheduled_products:
                interval = product.get("traceInterval", 60) or 60
                schedule.every(interval).minutes.do(self.track_product, product)
                self.scheduled_products.add(product_id)
                new_products_count += 1
                print(
                    f"🕐 Programado '{product['name']}' cada {interval} min (ID: {product_id})"
                )

        if new_products_count > 0:
            print(f"📊 Se programaron {new_products_count} nuevos productos")
        else:
            print("📊 No hay nuevos productos para programar")

    def cleanup_completed_jobs(self):
        """Limpia jobs de productos que ya no están activos"""
        current_products = {p["id"] for p in self.db.get_active_products()}

        # Encontrar productos programados que ya no están activos
        products_to_remove = self.scheduled_products - current_products

        if products_to_remove:
            print(f"🗑️ Eliminando {len(products_to_remove)} productos no activos")
            # Nota: schedule no permite eliminar jobs fácilmente por parámetro
            # En una implementación más avanzada, necesitarías trackear los jobs individualmente

        # Actualizar la lista de productos programados
        self.scheduled_products = current_products

    def start_from_db(self):
        """Inicia el tracker con chequeo periódico de nuevos productos"""
        # Programar chequeo de nuevos productos cada minuto
        schedule.every(1).minutes.do(self.check_new_products)

        # Limpiar productos no activos cada 5 minutos
        schedule.every(5).minutes.do(self.cleanup_completed_jobs)

        # Chequeo inicial
        print("🚀 Iniciando chequeo inicial de productos...")
        self.check_new_products()

        print("⏰ Monitor iniciado - Verificando nuevos productos cada minuto")
        while True:
            schedule.run_pending()
            time.sleep(1)

    # Método alternativo si prefieres una implementación más simple
    def start_simple(self):
        """Versión simple que verifica nuevos productos en cada iteración"""
        print("🚀 Iniciando monitor de productos...")

        while True:
            # Verificar y programar nuevos productos
            products = self.db.get_active_products()
            if products:
                for product in products:
                    product_id = product["id"]
                    if product_id not in self.scheduled_products:
                        interval = product.get("traceInterval", 60) or 60
                        schedule.every(interval).minutes.do(self.track_product, product)
                        self.scheduled_products.add(product_id)
                        print(f"🕐 Programado '{product['name']}' cada {interval} min")

            # Ejecutar jobs pendientes
            schedule.run_pending()
            time.sleep(60)  # Esperar 1 minuto entre verificaciones
