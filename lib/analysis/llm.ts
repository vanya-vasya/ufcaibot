import OpenAI from "openai";

const DEFAULT_MODEL = "gpt-5-mini";

let client: OpenAI | null = null;

const getClient = () => {
  if (!client) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY is not configured");
    client = new OpenAI({ apiKey, timeout: 50_000, maxRetries: 1 });
  }
  return client;
};

export const generateAnalysisText = async (
  systemPrompt: string,
  userPrompt: string
): Promise<string> => {
  const completion = await getClient().chat.completions.create({
    model: process.env.OPENAI_MODEL ?? DEFAULT_MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    // Not yet in the SDK typings; keeps the reasoning model fast enough for a 60s route.
    ...({ reasoning_effort: "low" } as Record<string, unknown>),
  });

  const text = completion.choices[0]?.message?.content?.trim();
  if (!text) throw new Error("OpenAI returned an empty analysis");
  return text;
};
