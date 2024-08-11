import puppeteer, { Browser, Page } from 'puppeteer';

class PuppeteerSetup {
  private browser: Browser | null = null;

  async getBrowser(): Promise<Browser> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        // headless: false,
        defaultViewport: {
          width: 1500,
          height: 1080,
        },
      });
    }

    return this.browser;
  }

  async newPage(): Promise<Page> {
    const browser = await this.getBrowser();
    return browser.newPage();
  }

  async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();

      this.browser = null;
    }
  }
}

export default new PuppeteerSetup();
