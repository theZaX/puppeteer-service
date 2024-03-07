import type { Viewport } from "puppeteer-core";
import puppeteer from "puppeteer-core";
import { validateUrl } from "./url.utils";
import storage from "./clients/storage";
import { inBrowser } from "./inBrowser";

export const htmlToPdf = async (html: string) => {
  return await inBrowser(async (browser) => {
    const page = await browser.newPage();
    await page.setContent(html);

    return await page.pdf({ format: "a4", printBackground: true });
  });
};

export const htmlToPng = async (html: string, viewport: Viewport) => {
  return await inBrowser(async (browser) => {
    const page = await browser.newPage();
    await page.setContent(html);
    await page.setViewport(viewport);

    return await page.screenshot({ type: "png" });
  });
};

export const urlToPng = async (url: string, viewport: Viewport) => {
  validateUrl(url);

  return await inBrowser(async (browser) => {
    const page = await browser.newPage();
    await page.goto(url);
    await page.setViewport(viewport);

    return await page.screenshot({ type: "png" });
  });
};

export const urlToPdf = async (
  url: string,
  format: any = "letter",
  storageKey: string
) => {
  validateUrl(url);

  const data = await inBrowser(async (browser) => {
    const page = await browser.newPage();

    try {
      await page.goto(url, {
        waitUntil: "networkidle2",
        timeout: 12000, // 10 seconds
      });

      await page.waitForTimeout(2000); // Wait for 1 second
    } catch (error) {
      if (error instanceof puppeteer.errors.TimeoutError) {
        console.log("Page load timed out, but proceeding to get the content.");
      } else {
        console.error("An unexpected error occurred:", error);
        throw error;
      }
    }

    console.log("rendering");

    return await page.pdf({ format, printBackground: true, landscape: false });
  });

  const buffer = data;

  const assetRef = storage.bucket("mindsmith").file(storageKey);

  console.log("saving");

  await assetRef.save(buffer, {
    contentType: "application/pdf",
  });

  return {
    url: `https://storage.googleapis.com/mindsmith/${storageKey}`,
  };
};

export const urlToHtml = async (url: string, format: any = "letter") => {
  validateUrl(url);

  return await inBrowser(async (browser) => {
    const page = await browser.newPage();

    try {
      await page.goto(url, {
        waitUntil: "networkidle0",
        timeout: 15000, // 10 seconds
      });
    } catch (error) {
      if (error instanceof puppeteer.errors.TimeoutError) {
        console.log("Page load timed out, but proceeding to get the content.");
      } else {
        console.error("An unexpected error occurred:", error);
        throw error;
      }
    }

    return await page.content();
  });
};
