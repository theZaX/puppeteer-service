import fastify from "fastify";
import { config } from "./config";
import {
  htmlToPdf,
  htmlToPng,
  urlToHtml,
  urlToPdf,
  urlToPng,
} from "./puppeteer";
import {
  htmlPdfRequest,
  htmlPngRequest,
  urlPdfRequest,
  urlPngRequest,
} from "./schemas";
import type { Viewport } from "puppeteer-core";

const server = fastify({
  logger: true,
});

server.post<{ Body: { html: string } }>(
  "/html/pdf",
  htmlPdfRequest,
  (request) => {
    const html = request.body.html;

    return htmlToPdf(html);
  }
);

server.post<{ Body: { html: string; viewport: Viewport } }>(
  "/html/png",
  htmlPngRequest,
  (request) => {
    const html = request.body.html;
    const viewport = request.body.viewport;

    return htmlToPng(html, viewport);
  }
);

server.post<{ Body: { url: string; viewport: Viewport } }>(
  "/url/png",
  urlPngRequest,
  (request) => {
    const url = request.body.url;
    const viewport = request.body.viewport;

    return urlToPng(url, viewport);
  }
);

server.post<{ Body: { url: string; format?: string } }>(
  "/url/pdf",
  urlPdfRequest,
  (request) => {
    const url = request.body.url;
    const format = request.body.format;
    return urlToPdf(url, format);
  }
);

server.post<{ Body: { url: string; format?: string } }>(
  "/url/html",
  urlPdfRequest,
  async (request, response) => {
    const url = request.body.url;
    const format = request.body.format;
    const html = await urlToHtml(url, format);
    // return this as an html

    response.type("text/html").send(html);
  }
);

const startServer = async () => {
  try {
    await server.listen(config.port, "0.0.0.0");
    server.log.info(`Puppeteer service API listening on ${config.port}`);
  } catch (err: unknown) {
    server.log.error(err);
    process.exit(1);
  }
};

startServer();
