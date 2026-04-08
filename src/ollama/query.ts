import { askOllama } from "./rag.js";

async function ask(question: string) {
    const result = await askOllama(question);
    console.log("Question asked", question);
    console.log("\nAnswer:\n", result.answer);
    console.log("\nSources:\n", result.sources);
}

// Example
ask("What are the four pillars of Ikigai?");
ask("What are the steps mentioned?");
ask("Who invented Ikigai?")
