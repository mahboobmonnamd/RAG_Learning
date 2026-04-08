import OpenAI from "openai";
import { collection } from "../db.js";
import "dotenv/config";

export type OpenAIQueryResult = {
  answer: string;
  sources: string[];
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function askOpenAI(question: string): Promise<OpenAIQueryResult> {
  const queryEmbedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: question,
  });
  const embedding = queryEmbedding.data[0]?.embedding;

  if (!embedding) {
    throw new Error("OpenAI did not return an embedding for the query.");
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

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });
  const answer = response.choices[0]?.message?.content;

  if (!answer) {
    throw new Error("OpenAI did not return a chat response.");
  }

  return {
    answer,
    sources,
  };
}
