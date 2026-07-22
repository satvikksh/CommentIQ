import axios, { type AxiosError, type AxiosResponse } from "axios";

import openRouter, { getOpenRouterConfig, normalizeOpenRouterModels } from "./client";

type JsonRecord = Record<string, unknown>;

interface ChatWithAIOptions {
  useFallbackModel?: boolean;
  retryReason?: string;
}

interface OpenRouterChoice {
  finish_reason?: string | null;
  native_finish_reason?: string | null;
  message?: JsonRecord | null;
  delta?: JsonRecord | null;
  text?: unknown;
  content?: unknown;
}

interface OpenRouterResponse {
  id?: string;
  model?: string;
  provider?: string;
  object?: string;
  choices?: OpenRouterChoice[];
  openrouter_metadata?: JsonRecord;
  usage?: unknown;
  output?: unknown;
}

interface OpenRouterFailureDetails {
  error: string;
  status: number;
  model: string;
  provider: string;
  endpoint: string;
  details: unknown;
  responseHeaders?: unknown;
  requestBody?: unknown;
}

export class OpenRouterRequestError extends Error {
  readonly status: number;
  readonly model: string;
  readonly provider: string;
  readonly endpoint: string;
  readonly details: unknown;
  readonly responseHeaders?: unknown;
  readonly requestBody?: unknown;

  constructor(message: string, failure: Omit<OpenRouterFailureDetails, "error">) {
    super(message);
    this.name = "OpenRouterRequestError";
    this.status = failure.status;
    this.model = failure.model;
    this.provider = failure.provider;
    this.endpoint = failure.endpoint;
    this.details = failure.details;
    this.responseHeaders = failure.responseHeaders;
    this.requestBody = failure.requestBody;
  }

  toResponseBody(): OpenRouterFailureDetails {
    return {
      success: false,
      error: this.message,
      status: this.status,
      model: this.model,
      provider: this.provider,
      endpoint: this.endpoint,
      details: this.details,
      responseHeaders: this.responseHeaders,
    } as OpenRouterFailureDetails & { success: false };
  }
}

class OpenRouterContentError extends OpenRouterRequestError {
  constructor(message: string, failure: Omit<OpenRouterFailureDetails, "error">) {
    super(message, failure);
    this.name = "OpenRouterContentError";
  }
}

export function isOpenRouterRequestError(error: unknown): error is OpenRouterRequestError {
  return error instanceof OpenRouterRequestError;
}

export function getUsableFallbackModels(primaryModel: string, fallbackModels: string[]) {
  return normalizeOpenRouterModels(primaryModel, fallbackModels).fallbackModels;
}

function isRecord(value: unknown): value is JsonRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function stringifyForLog(value: unknown) {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function getResponseStructure(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(getResponseStructure).join(", ")}]`;
  }

  if (!isRecord(value)) {
    return value === null ? "null" : typeof value;
  }

  return `{ ${Object.entries(value)
    .map(([key, nested]) => `${key}: ${getResponseStructure(nested)}`)
    .join(", ")} }`;
}

function extractTextFromContentBlocks(value: unknown): string[] {
  if (typeof value === "string") {
    return value.trim() ? [value] : [];
  }

  if (Array.isArray(value)) {
    return value.flatMap(extractTextFromContentBlocks);
  }

  if (!isRecord(value)) {
    return [];
  }

  const textCandidates = [
    value.text,
    value.content,
    value.output_text,
    value.summary,
    value.value,
  ];

  return textCandidates.flatMap(extractTextFromContentBlocks);
}

function extractReasoningText(value: unknown): string[] {
  if (typeof value === "string") {
    return value.trim() ? [value] : [];
  }

  if (Array.isArray(value)) {
    return value.flatMap(extractReasoningText);
  }

  if (!isRecord(value)) {
    return [];
  }

  return [
    ...extractTextFromContentBlocks(value.text),
    ...extractTextFromContentBlocks(value.summary),
    ...extractTextFromContentBlocks(value.reasoning),
    ...extractTextFromContentBlocks(value.reasoning_content),
    ...extractTextFromContentBlocks(value.content),
  ];
}

function extractAssistantText(response: OpenRouterResponse) {
  const choices = response.choices;

  if (!Array.isArray(choices) || choices.length === 0) {
    return {
      text: "",
      finishReason: null,
      provider: getProvider(response),
      source: "none",
    };
  }

  const candidateTexts: Array<{ source: string; text: string }> = [];
  const firstChoice = choices[0];
  const message = firstChoice.message ?? firstChoice.delta;

  if (message) {
    candidateTexts.push(
      ...extractTextFromContentBlocks(message.content).map((text) => ({
        source: "message.content",
        text,
      }))
    );

    candidateTexts.push(
      ...extractTextFromContentBlocks(message.output_text).map((text) => ({
        source: "message.output_text",
        text,
      }))
    );

    candidateTexts.push(
      ...extractTextFromContentBlocks(message.text).map((text) => ({
        source: "message.text",
        text,
      }))
    );

    candidateTexts.push(
      ...extractReasoningText(message.reasoning).map((text) => ({
        source: "message.reasoning",
        text,
      }))
    );

    candidateTexts.push(
      ...extractReasoningText(message.reasoning_content).map((text) => ({
        source: "message.reasoning_content",
        text,
      }))
    );

    candidateTexts.push(
      ...extractReasoningText(message.reasoning_details).map((text) => ({
        source: "message.reasoning_details",
        text,
      }))
    );
  }

  candidateTexts.push(
    ...extractTextFromContentBlocks(firstChoice.text).map((text) => ({
      source: "choice.text",
      text,
    })),
    ...extractTextFromContentBlocks(firstChoice.content).map((text) => ({
      source: "choice.content",
      text,
    })),
    ...extractTextFromContentBlocks(response.output).map((text) => ({
      source: "response.output",
      text,
    }))
  );

  const usable = candidateTexts.find(({ text }) => text.trim().length > 0);

  return {
    text: usable?.text.trim() ?? "",
    finishReason: firstChoice.finish_reason ?? firstChoice.native_finish_reason ?? null,
    provider: getProvider(response),
    source: usable?.source ?? "none",
  };
}

function getProvider(response: OpenRouterResponse | unknown) {
  if (!isRecord(response)) {
    return "unknown";
  }

  const metadata = response.openrouter_metadata;

  if (typeof response.provider === "string") {
    return response.provider;
  }

  if (isRecord(metadata)) {
    const provider =
      metadata.provider ??
      metadata.provider_name ??
      metadata.upstream_provider ??
      metadata.selected_provider;

    if (typeof provider === "string") {
      return provider;
    }
  }

  return "unknown";
}

function getProviderFromError(value: unknown) {
  if (!isRecord(value)) {
    return "unknown";
  }

  const metadata = isRecord(value.error) ? value.error.metadata : value.metadata;

  if (isRecord(metadata)) {
    const provider =
      metadata.provider ??
      metadata.provider_name ??
      metadata.upstream_provider ??
      metadata.selected_provider;

    if (typeof provider === "string") {
      return provider;
    }
  }

  return getProvider(value);
}

function buildEndpoint(baseURL: string, path: string) {
  return new URL(path.replace(/^\//, ""), `${baseURL.replace(/\/+$/, "")}/`).toString();
}

function buildRequestBody(prompt: string, model: string) {
  return {
    model,
    temperature: 0.1,
    stream: false,
    response_format: {
      type: "json_object",
    },
    reasoning: {
      exclude: true,
    },
    messages: [
      {
        role: "system",
        content:
          "You are CommentIQ's analysis engine. Return one valid JSON object only. Do not include markdown, code fences, prose, comments, or keys outside the requested schema.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  };
}

function assertValidModelId(model: string, role: "primary" | "fallback") {
  const trimmed = model.trim();

  if (!trimmed) {
    throw new OpenRouterRequestError(`Invalid ${role} model ID: model is empty`, {
      status: 500,
      model,
      provider: "unknown",
      endpoint: "OpenRouter configuration",
      details: `${role} model must be a non-empty OpenRouter model ID.`,
    });
  }

  if (!/^[^/\s]+\/[^/\s]+$/.test(trimmed)) {
    throw new OpenRouterRequestError(
      `Invalid ${role} model ID: "${model}". Expected an OpenRouter model ID like "openrouter/free".`,
      {
        status: 500,
        model,
        provider: "unknown",
        endpoint: "OpenRouter configuration",
        details: "OpenRouter model IDs must include an organization prefix and model slug separated by one slash.",
      }
    );
  }
}

function classifyStatus(status: number | undefined, fallbackMessage: string) {
  switch (status) {
    case 400:
      return "Invalid OpenRouter request";
    case 401:
      return "OpenRouter authentication failed";
    case 402:
      return "OpenRouter account has insufficient credits";
    case 403:
      return "OpenRouter model is not accessible";
    case 404:
      return "Model not found";
    case 408:
    case 504:
      return "OpenRouter provider timed out";
    case 429:
      return "OpenRouter rate limit exceeded";
    case 502:
      return "OpenRouter provider unavailable";
    case 503:
      return "No OpenRouter provider matched the routing requirements";
    default:
      return fallbackMessage;
  }
}

function normalizeAxiosError(
  error: AxiosError,
  model: string,
  endpoint: string,
  requestBody?: unknown
) {
  const status = error.response?.status ?? (error.code === "ECONNABORTED" ? 504 : 502);
  const responseBody = error.response?.data ?? error.message;
  const provider = getProviderFromError(responseBody);
  const message = classifyStatus(status, error.message);

  return new OpenRouterRequestError(message, {
    status,
    model,
    provider,
    endpoint,
    details: responseBody,
    responseHeaders: error.response?.headers,
    requestBody,
  });
}

function logAxiosFailure(
  error: AxiosError,
  context: {
    model: string;
    provider: string;
    endpoint: string;
    requestBody?: unknown;
    attempt: number;
    totalAttempts: number;
  }
) {
  console.error("[OpenRouter] request failed", {
    model: context.model,
    provider: context.provider,
    endpoint: context.endpoint,
    attempt: context.attempt,
    totalAttempts: context.totalAttempts,
    status: error.response?.status,
    responseHeaders: error.response?.headers,
    responseBody: error.response?.data,
    requestURL: error.config?.url,
    baseURL: error.config?.baseURL,
    requestPayload: context.requestBody,
    axiosCode: error.code,
    errorMessage: error.message,
  });
}

async function sendOpenRouterRequest(
  prompt: string,
  model: string,
  apiKey: string,
  baseURL: string,
  attempt: number,
  totalAttempts: number
) {
  assertValidModelId(model, attempt === 1 ? "primary" : "fallback");

  const path = "/chat/completions";
  const endpoint = buildEndpoint(baseURL, path);
  const requestBody = buildRequestBody(prompt, model);

  console.log("[OpenRouter] request", {
    method: "POST",
    path,
    endpoint,
    requestURL: endpoint,
    baseURL,
    model,
    fallbackAttempt: attempt > 1,
    attempt,
    totalAttempts,
    provider: "auto",
    requestBody,
  });

  let response: AxiosResponse<OpenRouterResponse>;

  try {
    response = await openRouter.post<OpenRouterResponse>(path, requestBody, {
      baseURL,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "X-OpenRouter-Metadata": "enabled",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
        "X-OpenRouter-Title": "CommentIQ",
      },
    });
  } catch (error) {
    if (!axios.isAxiosError(error)) {
      throw new OpenRouterRequestError("OpenRouter request failed", {
        status: 502,
        model,
        provider: "unknown",
        endpoint,
        details: error instanceof Error ? error.message : stringifyForLog(error),
        requestBody,
      });
    }

    logAxiosFailure(error, {
      model,
      provider: getProviderFromError(error.response?.data),
      endpoint,
      requestBody,
      attempt,
      totalAttempts,
    });

    throw normalizeAxiosError(error, model, endpoint, requestBody);
  }

  console.log("[OpenRouter] response", {
    endpoint,
    status: response.status,
    statusText: response.statusText,
    responseHeaders: response.headers,
    responseBody: response.data,
    requestedModel: model,
    returnedModel: response.data?.model,
    provider: getProvider(response.data),
    finishReason:
      response.data?.choices?.[0]?.finish_reason ??
      response.data?.choices?.[0]?.native_finish_reason ??
      null,
    responseStructure: getResponseStructure(response.data),
    usage: response.data?.usage,
  });

  const extracted = extractAssistantText(response.data);

  console.log("[OpenRouter] parsed content", {
    model,
    returnedModel: response.data?.model,
    provider: extracted.provider,
    finishReason: extracted.finishReason,
    source: extracted.source,
    contentCharacters: extracted.text.length,
    contentPreview: extracted.text.slice(0, 500),
  });

  if (!extracted.text) {
    throw new OpenRouterContentError("OpenRouter returned no usable assistant content", {
      status: 502,
      model,
      provider: extracted.provider,
      endpoint,
      details: {
        finishReason: extracted.finishReason,
        responseStructure: getResponseStructure(response.data),
        responseBody: response.data,
      },
      responseHeaders: response.headers,
      requestBody,
    });
  }

  return extracted.text;
}

export async function chatWithAI(prompt: string, options: ChatWithAIOptions = {}) {
  const { apiKey, baseURL, model, fallbackModels } = getOpenRouterConfig();
  assertValidModelId(model, "primary");

  const usableFallbackModels = getUsableFallbackModels(model, fallbackModels);
  usableFallbackModels.forEach((fallbackModel) => assertValidModelId(fallbackModel, "fallback"));

  const modelsToTry = options.useFallbackModel ? usableFallbackModels : [model, ...usableFallbackModels];

  if (modelsToTry.length === 0) {
    throw new OpenRouterRequestError("Missing fallback model", {
      status: 500,
      model,
      provider: "unknown",
      endpoint: "OpenRouter configuration",
      details:
        "A fallback retry was requested, but OPENROUTER_FALLBACK_MODELS has no non-empty model different from OPENROUTER_MODEL.",
    });
  }

  console.log("[OpenRouter] model selection", {
    primaryModel: model,
    configuredFallbackModels: fallbackModels,
    usableFallbackModels,
    selectedModel: modelsToTry[0],
    retryReason: options.retryReason,
  });

  let lastError: unknown;

  for (const [index, selectedModel] of modelsToTry.entries()) {
    const attempt = index + 1;

    try {
      if (attempt > 1 || options.useFallbackModel) {
        console.warn("[OpenRouter] retrying with fallback model", {
          primaryModel: model,
          fallbackModel: selectedModel,
          retryReason:
            options.retryReason ??
            (lastError instanceof Error ? lastError.message : stringifyForLog(lastError)),
          attempt,
          totalAttempts: modelsToTry.length,
        });
      }

      const content = await sendOpenRouterRequest(
        prompt,
        selectedModel,
        apiKey,
        baseURL,
        attempt,
        modelsToTry.length
      );

      console.log("[OpenRouter] final selected model", {
        model: selectedModel,
        attempt,
      });

      return content;
    } catch (error) {
      lastError = error;

      console.error("[OpenRouter] attempt failed", {
        model: selectedModel,
        attempt,
        totalAttempts: modelsToTry.length,
        willRetry: attempt < modelsToTry.length,
        error: error instanceof Error ? error.message : stringifyForLog(error),
        details: isOpenRouterRequestError(error) ? error.toResponseBody() : undefined,
      });

      if (attempt >= modelsToTry.length) {
        throw error;
      }
    }
  }

  throw new OpenRouterRequestError("OpenRouter request failed", {
    status: 502,
    model,
    provider: "unknown",
    endpoint: buildEndpoint(baseURL, "/chat/completions"),
    details: stringifyForLog(lastError),
  });
}
