// For more information, see https://crawlee.dev/
import { PlaywrightCrawler } from "crawlee";

// PlaywrightCrawler crawls the web using a headless
// browser controlled by the Playwright library.
const crawler = new PlaywrightCrawler({
  // Use the requestHandler to process each of the crawled pages.
  async requestHandler({ request, page, enqueueLinks, log, pushData }) {
    const title = await page.title();
    log.info(`Title of ${request.loadedUrl} is '${title}'`);
    // Save results as JSON to ./storage/datasets/default
    await pushData({ title, url: request.loadedUrl });

    // Extract links from the current page
    // and add them to the crawling queue.
    await enqueueLinks();
  },
  // Comment this option to scrape the full website.
  maxRequestsPerCrawl: 1,
  // Uncomment this option to see the browser window.
  headless: false,
});

// https://crawlee.dev/js/docs/introduction/real-world-project

// Add first URL to the queue and start the crawl.
const product = encodeURI("MacBook Pro 2025");
// await crawler.run([`https://listado.mercadolibre.com.mx/${product}`]);
await crawler.run([`https://www.amazon.com.mx/s?k=${product}`]);
// await crawler.run([`https://www.walmart.com.mx/search?q=${product}`]);
