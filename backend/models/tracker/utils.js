const sopported_domains = [
  "www.mercadolibre.com.mx",
  "www.amazon.com.mx",
  "es.aliexpress.com",
];

export function verifyDomainLink(url_string) {
  const url_domain = new URL(url_string).hostname;
  console.log(`hostname: ${url_domain}`);
  return sopported_domains.includes(url_domain);
}
