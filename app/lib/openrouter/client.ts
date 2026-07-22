import axios from "axios";

export interface OpenRouterConfig {
  apiKey: string;
  baseURL: string;
  model: string;
  fallbackModels: string[];
}

export class OpenRouterConfigError extends Error {
  readonly status = 500;
  readonly endpoint = "OpenRouter configuration";
  readonly details: string;

  constructor(message: string, details: string) {
    super(message);
    this.name = "OpenRouterConfigError";
    this.details = details;
  }
}

export function isOpenRouterConfigError(error: unknown): error is OpenRouterConfigError {
  return error instanceof OpenRouterConfigError;
}

function parseCsv(value: string | undefined) {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeBaseURL(baseURL: string) {
  try {
    return new URL(baseURL).toString().replace(/\/+$/, "");
  } catch {
    throw new OpenRouterConfigError(
      "Invalid OpenRouter base URL",
      "OPENROUTER_BASE_URL must be a valid absolute URL, for example https://openrouter.ai/api/v1."
    );
  }
}

export function normalizeOpenRouterModels(primaryModel: string, fallbackModels: string[]) {
  const normalizedPrimary = primaryModel.trim();
  const seen = new Set<string>();
  const normalizedFallbackModels: string[] = [];

  seen.add(normalizedPrimary);

  for (const fallbackModel of fallbackModels) {
    const normalizedFallback = fallbackModel.trim();

    if (!normalizedFallback || seen.has(normalizedFallback)) {
      continue;
    }

    seen.add(normalizedFallback);
    normalizedFallbackModels.push(normalizedFallback);
  }

  return {
    model: normalizedPrimary,
    fallbackModels: normalizedFallbackModels,
  };
}

export function getOpenRouterConfig() {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  const baseURL = process.env.OPENROUTER_BASE_URL?.trim();
  const model = process.env.OPENROUTER_MODEL?.trim();
  const fallbackModels = parseCsv(process.env.OPENROUTER_FALLBACK_MODELS);

  const missing = [
    ["OPENROUTER_API_KEY", apiKey],
    ["OPENROUTER_BASE_URL", baseURL],
    ["OPENROUTER_MODEL", model],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missing.length) {
    throw new OpenRouterConfigError(
      "Missing OpenRouter configuration",
      `Missing ${missing.join(
        ", "
      )}. Define OPENROUTER_API_KEY, OPENROUTER_BASE_URL, OPENROUTER_MODEL, and optionally OPENROUTER_FALLBACK_MODELS.`
    );
  }

  const normalized = normalizeOpenRouterModels(model!, fallbackModels);

  return {
    apiKey: apiKey!,
    baseURL: normalizeBaseURL(baseURL!),
    model: normalized.model,
    fallbackModels: normalized.fallbackModels,
  };
}

const openRouter = axios.create({
  headers: {
    "Content-Type": "application/json",
  },

  timeout: 120000,
});

export default openRouter;
