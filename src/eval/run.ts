import { evaluationQuestions, type EvaluationCase } from "./questions.js";

export type QueryResult = {
  answer: string;
  sources: string[];
};

type Provider = {
  ask: (question: string) => Promise<QueryResult>;
};

function normalize(text: string) {
  return text.trim().toLowerCase();
}

function isUnknownAnswer(answer: string) {
  const normalized = normalize(answer);
  return normalized.includes("i don't know") || normalized.includes("do not know");
}

function matchesExpectedAnswer(answer: string, testCase: EvaluationCase) {
  if (!testCase.expectedAnswerIncludes?.length) {
    return true;
  }

  const normalizedAnswer = normalize(answer);
  return testCase.expectedAnswerIncludes.every((expected) =>
    normalizedAnswer.includes(normalize(expected)),
  );
}

export async function runEvaluation(providerName: string, provider: Provider) {
  let passed = 0;

  console.log(`Running evaluation for ${providerName}...`);
  console.log(`Total test cases: ${evaluationQuestions.length}\n`);

  for (const testCase of evaluationQuestions) {
    const result = await provider.ask(testCase.question);
    const unknown = isUnknownAnswer(result.answer);
    const contentMatch = matchesExpectedAnswer(result.answer, testCase);
    const pass = testCase.expectedUnknown ? unknown : !unknown && contentMatch;

    if (pass) {
      passed += 1;
    }

    console.log(`[${pass ? "PASS" : "FAIL"}] ${testCase.id}`);
    console.log(`Question: ${testCase.question}`);
    console.log(`Expected unknown: ${testCase.expectedUnknown ? "yes" : "no"}`);
    console.log(`Detected unknown: ${unknown ? "yes" : "no"}`);

    if (!testCase.expectedUnknown) {
      console.log(
        `Expected answer hints: ${testCase.expectedAnswerIncludes?.join(", ") ?? "n/a"}`,
      );
    }

    console.log(`Answer: ${result.answer}`);
    console.log(`Sources returned: ${result.sources.length}\n`);
  }

  console.log(`Final score for ${providerName}: ${passed}/${evaluationQuestions.length}`);
}
