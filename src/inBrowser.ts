import type { Browser } from "puppeteer-core";
import puppeteer from "puppeteer-core";
import { config } from "./config";

export const inBrowser = async <T>(callback: (browser: Browser) => T) => {
  const browser = await puppeteer.launch({
    executablePath: config.chromeBinaryPath,
    // https://github.com/buildkite/docker-puppeteer/blob/master/example/integration-tests/index.test.js
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  });

  const result = await callback(browser);

  await browser.close();

  return result;
};
