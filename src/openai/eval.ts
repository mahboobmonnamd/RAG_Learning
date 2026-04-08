import { runEvaluation } from "../eval/run.js";
import { askOpenAI } from "./rag.js";

await runEvaluation("OpenAI", {
  ask: askOpenAI,
});
