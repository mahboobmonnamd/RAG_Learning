import fs from "fs";
import { PDFParse } from "pdf-parse";

export async function loadPDF(path: string) {
    const buffer = fs.readFileSync(path);
    const parser = await new PDFParse({ data: buffer });
    return (await parser.getText()).text;
}

export function chunkText(text: string, size = 700, overlap = 100) {
    const chunks: string[] = [];

    for (let i = 0; i < text.length; i += size - overlap) {
        chunks.push(text.slice(i, i + size));
    }

    return chunks;
}
