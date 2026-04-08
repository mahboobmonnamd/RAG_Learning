import { Ollama } from "ollama";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chunkText, chunkTextBySection, loadPDF } from "../utils.js";
import { collection } from "../db.js";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ollama = new Ollama({
    host: process.env.OLLAMA_HOST ?? "http://192.168.88.35:11434",
});
const embeddingModel = process.env.OLLAMA_EMBED_MODEL ?? "llama3.2:3b";
const pdfPath = path.resolve(__dirname, "../../sample.pdf");

async function run() {
    const text = await loadPDF(pdfPath);
    // const chunks = chunkText(text);
    const chunks = chunkTextBySection(text);

    const embeddings = await ollama.embed({
        model: embeddingModel,
        input: chunks,
    });

    await collection.add({
        ids: chunks.map((_, i) => `id-${i}`),
        documents: chunks,
        embeddings: embeddings.embeddings,
        metadatas: chunks.map((_, i) => ({
            source: "sample.pdf",
            chunk: i,
          })),
    });

    console.log("Ingested!");
}

run();
