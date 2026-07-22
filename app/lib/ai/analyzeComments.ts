import { chatWithAI, getUsableFallbackModels, isOpenRouterRequestError } from "../openrouter/chat";
import { getOpenRouterConfig } from "../openrouter/client";
import { buildCommentAnalysisPrompt } from "./prompt";
import { aiAnalysisSchema } from "./schema";

function formatIssues(error: { issues: Array<{ path: PropertyKey[]; message: string }> }) {
  return error.issues.map((issue) => issue.path.join(".") || issue.message).join(", ");
}

async function getValidatedAnalysis(prompt: string, useFallbackModel = false, retryReason?: string) {
  const rawContent = await chatWithAI(prompt, { useFallbackModel, retryReason });

  console.log("[AI] raw content", rawContent);

  let parsed: unknown;

  try {
    parsed = JSON.parse(rawContent);
  } catch (error) {
    console.error("[AI] JSON parsing failed", {
      error: error instanceof Error ? error.message : error,
      rawContent,
    });

    throw new Error("AI returned invalid JSON");
  }

  console.log("[AI] parsed JSON", parsed);

  const validation = aiAnalysisSchema.safeParse(parsed);

  if (!validation.success) {
    console.error("[AI] Zod validation failed", {
      issues: validation.error.issues,
      rawContent,
      parsed,
    });
    throw new Error(`AI analysis validation failed: ${formatIssues(validation.error)}`);
  }

  return validation.data;
}

export async function analyzeComments(comments: string[]) {
  const prompt = buildCommentAnalysisPrompt(comments);

  try {
    return await getValidatedAnalysis(prompt);
  } catch (error) {
    if (isOpenRouterRequestError(error)) {
      throw error;
    }

    const retryReason = error instanceof Error ? error.message : "AI analysis failed";
    const { model, fallbackModels } = getOpenRouterConfig();
    const usableFallbackModels = getUsableFallbackModels(model, fallbackModels);

    if (!usableFallbackModels.length) {
      console.warn("[AI] primary model produced unusable JSON; no fallback model configured", {
        retryReason,
        primaryModel: model,
        configuredFallbackModels: fallbackModels,
      });

      throw error;
    }

    console.warn("[AI] primary model produced unusable JSON; retrying fallback once", {
      retryReason,
      primaryModel: model,
      fallbackModels: usableFallbackModels,
    });

    return getValidatedAnalysis(prompt, true, retryReason);
  }
}
