import { askOpenAI } from "./rag.js";

async function ask(question: string) {
  const result = await askOpenAI(question);
  console.log("\nAnswer:\n", result.answer);
  console.log("\nSources:\n", result.sources);
}

// Example
ask("What is this document about?");
