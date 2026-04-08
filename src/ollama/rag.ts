import { Ollama } from "ollama";
import { collection } from "../db.js";
import "dotenv/config";

export type OllamaQueryResult = {
  answer: string;
  sources: string[];
};

const ollama = new Ollama({
  host: process.env.OLLAMA_HOST ?? "http://192.168.88.35:11434",
});
const embeddingModel = process.env.OLLAMA_EMBED_MODEL ?? "llama3.2:3b";
const chatModel = process.env.OLLAMA_CHAT_MODEL ?? "llama3.2:3b";

export async function askOllama(question: string): Promise<OllamaQueryResult> {
  const queryEmbedding = await ollama.embed({
    model: embeddingModel,
    input: question,
  });

  const embedding = queryEmbedding.embeddings[0];

  if (!embedding) {
    throw new Error("Ollama did not return an embedding for the query.");
  }

  const results = await collection.query({
    queryEmbeddings: [embedding],
    nResults: 4,
  });

  const sources = (results.documents?.[0] ?? []).filter(
    (document): document is string => typeof document === "string",
  );
  const context = sources.join("\n");

  const prompt = `
Answer ONLY from the context below.
If not found, say "I don't know".

Context:
${context}

Question:
${question}
`;

  const response = await ollama.chat({
    model: chatModel,
    messages: [{ role: "user", content: prompt }],
  });
  const answer = response.message?.content;

  if (!answer) {
    throw new Error("Ollama did not return a chat response.");
  }

  return {
    answer,
    sources,
  };
}
