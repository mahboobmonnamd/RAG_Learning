import { runEvaluation } from "../eval/run.js";
import { askOllama } from "./rag.js";

await runEvaluation("Ollama", {
  ask: askOllama,
});
