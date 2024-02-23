import express from "express";
import { z } from "zod";
import { config } from "./config";
import {
  htmlToPdf,
  htmlToPng,
  urlToHtml,
  urlToPdf,
  urlToPng,
} from "./puppeteer";
import { urlsToPDF } from "./urlsToPDF";

const app = express();
app.use(express.json());

const viewportSchema = z.object({
  width: z.number(),
  height: z.number(),
});

const htmlPdfRequestSchema = z.object({
  html: z.string(),
});

const htmlPngRequestSchema = z.object({
  html: z.string(),
  viewport: viewportSchema,
});

const urlPngRequestSchema = z.object({
  url: z.string(),
  viewport: viewportSchema,
});

const urlPdfRequestSchema = z.object({
  url: z.string(),
  format: z.string().optional(),
  storageKey: z.string(),
});

const urlHtmlRequestSchema = z.object({
  url: z.string(),
  format: z.string().optional(),
});

app.post("/html/pdf", async (req, res) => {
  const result = htmlPdfRequestSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json(result.error);
  }
  const { html } = result.data;
  const pdf = await htmlToPdf(html);

  res.json(pdf);
});

app.post("/html/png", async (req, res) => {
  const result = htmlPngRequestSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json(result.error);
  }
  const { html, viewport } = result.data;
  const png = await htmlToPng(html, viewport);
  res.json(png);
});

app.post("/url/png", async (req, res) => {
  const result = urlPngRequestSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json(result.error);
  }
  const { url, viewport } = result.data;
  const png = await urlToPng(url, viewport);
  res.json(png);
});

app.post("/url/pdf", async (req, res) => {
  const result = urlPdfRequestSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json(result.error);
  }
  const { url, format, storageKey } = result.data;
  const pdf = await urlToPdf(url, format, storageKey);
  res.json(pdf);
});

const urlsPdfSchema = z.object({
  urls: z.array(z.string()),
  storageKey: z.string(),
});

app.post("/urls/pdf", async (req, res) => {
  const result = urlsPdfSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json(result.error);
  }
  const { urls, storageKey } = result.data;
  const pdf = await urlsToPDF(urls, storageKey);
  res.json(pdf);
});

app.post("/url/html", async (req, res) => {
  const result = urlHtmlRequestSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json(result.error);
  }
  const { url, format } = result.data;
  const html = await urlToHtml(url, format);
  res.type("text/html").send(html);
});

const startServer = async () => {
  try {
    app.listen(Number(config.port), "0.0.0.0", () => {
      console.log(`Puppeteer service API listening on ${config.port}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

startServer();
