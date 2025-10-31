import smtplib
from email.mime.text import MIMEText
import requests
import os

class Notifier:
    def __init__(self):
        self.telegram_token = os.getenv("TELEGRAM_TOKEN")
        self.telegram_chat_id = os.getenv("TELEGRAM_CHAT_ID")
        self.smtp_user = os.getenv("SMTP_USER")
        self.smtp_pass = os.getenv("SMTP_PASS")
        self.smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", 587))
        self.sms_api_key = os.getenv("SMS_API_KEY")

    def send_email(self, to_email, subject, message):
        try:
            msg = MIMEText(message)
            msg["Subject"] = subject
            msg["From"] = self.smtp_user
            msg["To"] = to_email
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_user, self.smtp_pass)
                server.send_message(msg)
            print(f"📧 Email enviado a {to_email}")
        except Exception as e:
            print(f"⚠️ Error al enviar correo: {e}")

    def send_telegram(self, message):
        if not self.telegram_token or not self.telegram_chat_id:
            print("⚠️ Falta configurar TELEGRAM_TOKEN o TELEGRAM_CHAT_ID")
            return
        try:
            url = f"https://api.telegram.org/bot{self.telegram_token}/sendMessage"
            data = {"chat_id": self.telegram_chat_id, "text": message}
            requests.post(url, data=data)
            print("💬 Notificación enviada por Telegram")
        except Exception as e:
            print(f"⚠️ Error al enviar por Telegram: {e}")

    def send_sms(self, phone_number, message):
        if not self.sms_api_key:
            print("⚠️ Falta configurar SMS_API_KEY")
            return
        try:
            response = requests.post("https://textbelt.com/text", {
                "phone": phone_number,
                "message": message,
                "key": self.sms_api_key
            })
            print("📱 SMS enviado:", response.json())
        except Exception as e:
            print(f"⚠️ Error al enviar SMS: {e}")
