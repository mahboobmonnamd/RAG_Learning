export type EvaluationCase = {
  id: string;
  question: string;
  expectedAnswerIncludes?: string[];
  expectedUnknown: boolean;
};

export const evaluationQuestions: EvaluationCase[] = [
  {
    id: "known-topic",
    question: "What is this document about?",
    expectedAnswerIncludes: ["Ikigai"],
    expectedUnknown: false,
  },
  {
    id: "known-definition",
    question: "What does Ikigai mean?",
    expectedAnswerIncludes: ["reason for being"],
    expectedUnknown: false,
  },
  {
    id: "known-pillars",
    question: "What are the four pillars of Ikigai?",
    expectedAnswerIncludes: ["what you love", "what you are good at"],
    expectedUnknown: false,
  },
  {
    id: "known-benefit",
    question: "Why does Ikigai matter?",
    expectedAnswerIncludes: ["purpose", "motivated"],
    expectedUnknown: false,
  },
  {
    id: "known-steps",
    question: "What practical steps does the document suggest?",
    expectedAnswerIncludes: ["Exploring your interests", "Experiment"],
    expectedUnknown: false,
  },
  {
    id: "known-conclusion",
    question: "How does the document describe Ikigai in the conclusion?",
    expectedAnswerIncludes: ["continuous journey", "self-discovery"],
    expectedUnknown: false,
  },
  {
    id: "unknown-inventor",
    question: "Who invented Ikigai?",
    expectedUnknown: true,
  },
  {
    id: "unknown-food",
    question: "How do you cook biryani?",
    expectedUnknown: true,
  },
];
