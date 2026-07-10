import openRouter from "./client";

export async function chatWithAI(prompt: string) {
  try {
    if (!process.env.OPENROUTER_MODEL) {
      throw new Error("OPENROUTER_MODEL is not configured");
    }

    const response = await openRouter.post("/chat/completions", {
      model: process.env.OPENROUTER_MODEL,

      temperature: 0.2,

      response_format: {
        type: "json_object",
      },

      messages: [
        {
          role: "system",
          content:
            "You are an AI specialized in analyzing YouTube comments. Always return valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return response.data.choices[0].message.content;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error.response?.data || error);

    throw new Error("OpenRouter request failed");
  }
}
