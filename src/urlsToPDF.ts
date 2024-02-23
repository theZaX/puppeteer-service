import { Page } from "puppeteer-core";
import { inBrowser } from "./inBrowser";
import storage from "./clients/storage";
import { PDFDocument } from "pdf-lib";

export const smartURLToPDF = async (url: string, page: Page) => {
  await page.goto(url, {
    waitUntil: "networkidle2",
    timeout: 12000, // 10 seconds
  });

  await page.waitForTimeout(2000); // Wait for 1 second

  let height = await page.evaluate(() => document.body.scrollHeight);

  return await page.pdf({
    printBackground: true,
    height: height + "px",
    width: "1066px",
  });
};

const smartURLToPDFWithRetry = async (url: string, page: Page) => {
  let retries = 2;
  while (retries > 0) {
    try {
      return await smartURLToPDF(url, page);
    } catch (e) {
      console.log(
        `Failed to process ${url}, retrying... (${3 - retries} attempt)`
      );
      retries--;
    }
  }
  throw new Error(`Failed to process ${url} after multiple retries.`);
};

const mergePDFs = async (pdfs: Buffer[]) => {
  const mergedPdf = await PDFDocument.create();

  for (const pdfBuffer of pdfs) {
    const donorPdfDoc = await PDFDocument.load(pdfBuffer);
    const donorPdfPages = await mergedPdf.copyPages(
      donorPdfDoc,
      donorPdfDoc.getPageIndices()
    );

    for (const page of donorPdfPages) {
      mergedPdf.addPage(page);
    }
  }

  const pdfBytes = await mergedPdf.save();

  return Buffer.from(pdfBytes);
};

export const urlsToPDF = async (urls: string[], storageKey: string) => {
  const data = await inBrowser(async (browser) => {
    const buffers = [];
    for (let i = 0; i < urls.length; i += 12) {
      const chunk = urls.slice(i, i + 12);
      const pdfPromises = chunk.map(async (url) => {
        const page = await browser.newPage();
        await page.setViewport({ width: 1066, height: 700, isLandscape: true });
        const pdf = await smartURLToPDFWithRetry(url, page);
        await page.close();

        console.log(`Finished processing ${url}`);

        return pdf;
      });
      const chunkBuffers = await Promise.all(pdfPromises);
      buffers.push(...chunkBuffers);
    }
    return buffers;
  });

  const mergedPdf = await mergePDFs(data);

  const assetRef = storage.bucket("mindsmith").file(storageKey);

  console.log(`Saving to ${storageKey}`);

  await assetRef.save(mergedPdf, {
    contentType: "application/pdf",
  });

  return {
    url: `https://storage.googleapis.com/mindsmith/${storageKey}`,
  };
};
