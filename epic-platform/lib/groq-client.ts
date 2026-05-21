import Groq from "groq-sdk";

let groqClient: Groq | null = null;

export function initGroqClient(apiKey: string): Groq {
  if (!groqClient) {
    groqClient = new Groq({
      apiKey: apiKey,
    });
  }
  return groqClient;
}

export function getGroqClient(): Groq {
  if (!groqClient) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY environment variable is not set");
    }
    return initGroqClient(apiKey);
  }
  return groqClient;
}

export async function testGroqConnection(prompt: string = "Say 'Hello from Groq!'") {
  try {
    const client = getGroqClient();
    const message = await client.chat.completions.create({
      model: "mixtral-8x7b-32768",
      max_tokens: 256,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    return {
      success: true,
      response: message.choices[0].message.content || "",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
