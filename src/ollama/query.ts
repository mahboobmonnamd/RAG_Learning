import { Ollama } from "ollama";
import { collection } from "../db.js";
import "dotenv/config";

const ollama = new Ollama({
    host: process.env.OLLAMA_HOST ?? "http://192.168.88.35:11434",
});
const embeddingModel = process.env.OLLAMA_EMBED_MODEL ?? "llama3.2:3b";
const chatModel = process.env.OLLAMA_CHAT_MODEL ?? "llama3.2:3b";

async function ask(question: string) {
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
        nResults: 3,
    });

    const context = results.documents?.[0]?.join("\n") || "";

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
    console.log("Results from db:", results)
    console.log("Question asked", question)
    console.log("\nAnswer:\n", answer);
    console.log("\nSources:\n", results.documents?.[0]);
}

// Example
ask("What are the four pillars of Ikigai?");
ask("What are the steps mentioned?");
ask("Who invented Ikigai?")
