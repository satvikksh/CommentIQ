import { chatWithAI } from "../openrouter/chat";
import { buildCommentAnalysisPrompt } from "./prompt";

export async function analyzeComments(comments: string[]) {
  const prompt = buildCommentAnalysisPrompt(comments);

  const result = await chatWithAI(prompt);

  return JSON.parse(result);
}