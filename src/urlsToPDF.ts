import { Page } from "puppeteer-core";
import { inBrowser } from "./inBrowser";
import storage from "./clients/storage";
import { PDFDocument } from "pdf-lib";

export const smartURLToPDF = async (url: string, page: Page) => {
  await page.goto(url, {
    waitUntil: "networkidle0",
    timeout: 25000, // 10 seconds
  });

  await page.waitForTimeout(5000); // Wait for an additional 3 seconds

  let height = await page.evaluate(() => document.body.scrollHeight);

  return await page.pdf({
    printBackground: true,
    height: height + "px",
    width: "1066px",
  });
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
    for (let i = 0; i < urls.length; i += 10) {
      const chunk = urls.slice(i, i + 10);
      const pdfPromises = chunk.map(async (url) => {
        const page = await browser.newPage();
        await page.setViewport({ width: 1066, height: 600, isLandscape: true });
        const pdf = await smartURLToPDF(url, page);
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

  await assetRef.save(mergedPdf, {
    contentType: "application/pdf",
  });

  return {
    url: `https://storage.googleapis.com/mindsmith/${storageKey}`,
  };
};
