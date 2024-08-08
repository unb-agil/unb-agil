abstract class BaseScraper {
  abstract scrape(): Promise<void>;
}

export default BaseScraper;
