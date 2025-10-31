import requests
from bs4 import BeautifulSoup
from fake_useragent import UserAgent

ua = UserAgent()

class PriceScraper:
    def __init__(self):
        self.headers = {'User-Agent': ua.random}

    def identify_site(self, url):
        if "amazon" in url:
            return "Amazon"
        elif "mercadolibre" in url:
            return "MercadoLibre"
        elif "walmart" in url:
            return "Walmart"
        elif "coppel" in url:
            return "Coppel"
        else:
            return "Desconocido"

    def get_price_and_name(self, url):
        site = self.identify_site(url)
        if site == "Amazon":
            return self._scrape_amazon(url)
        elif site == "MercadoLibre":
            return self._scrape_mercadolibre(url)
        elif site == "Walmart":
            return self._scrape_walmart(url)
        elif site == "Coppel":
            return self._scrape_coppel(url)
        else:
            raise ValueError("Sitio no soportado actualmente.")
        
    def _scrape_coppel(self, url):
        r = requests.get(url, headers=self.headers)
        soup = BeautifulSoup(r.content, 'html.parser')
        title = soup.find('p', class_='chakra-text css-12srdds')
        content_div = soup.find('h2', class_='chakra-text css-ojzzfi') #Esto es el precio

        if not content_div:
            content_div = soup.find('h2', class_='chakra-text css-17ixpwi')

        #content_div = content_div.text.strip().replace('$','')
        return title.text.strip(), content_div.text.strip().replace('$',''), "Coppel"

    def _scrape_amazon(self, url):
        r = requests.get(url, headers=self.headers)
        soup = BeautifulSoup(r.text, 'html.parser')
        title = soup.select_one("#productTitle")
        price = soup.find('span',class_='a-price-whole')
        if not title or not price:
            raise ValueError("No se encontró el título o precio en Amazon.")
        return title.text.strip(), price.text.strip().replace('.',""), "Amazon"

    def _scrape_mercadolibre(self, url):
        r = requests.get(url, headers=self.headers)
        soup = BeautifulSoup(r.text, 'html.parser')
        title = soup.select_one("h1.ui-pdp-title")
        price = soup.select_one(".andes-money-amount__fraction")
        if not title or not price:
            raise ValueError("No se encontró el título o precio en MercadoLibre.")
        return title.text.strip(), price.text.strip(), "MercadoLibre"

    def _scrape_walmart(self, url):
        r = requests.get(url, headers=self.headers)
        soup = BeautifulSoup(r.text, 'html.parser')
        title = soup.select_one("h1.prod-ProductTitle")
        price = soup.select_one("span.price-characteristic")
        if not title or not price:
            raise ValueError("No se encontró el título o precio en Walmart.")
        return title.text.strip(), price.text.strip(), "Walmart"
