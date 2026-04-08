import OpenAI from "openai";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { collection } from "../db.js";
import { loadPDF, chunkText } from "../utils.js";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const pdfPath = path.resolve(__dirname, "../../sample.pdf");

async function run() {
  const text = await loadPDF(pdfPath);
  const chunks = chunkText(text);

  const embeddings = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: chunks,
  });

  await collection.add({
    ids: chunks.map((_, i) => `id-${i}`),
    documents: chunks,
    embeddings: embeddings.data.map(e => e.embedding),
  });

  console.log("Ingested!");
}

run();
