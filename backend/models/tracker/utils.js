import { readFile } from "fs/promises";

const sopported_domains = [
  "articulo.mercadolibre.com.mx",
  "www.amazon.com.mx",
  "es.aliexpress.com",
];

export function verifyDomainLink(url_string) {
  const url_domain = new URL(url_string).hostname;
  console.log(`hostname: ${url_domain}`);
  return sopported_domains.includes(url_domain);
}

export async function getHistoryData(id) {
  try {
    const historyData = JSON.parse(
      await readFile(`trackers/${id}.json`, "utf8"),
    );
    return historyData;
  } catch (error) {
    return [];
  }
}
