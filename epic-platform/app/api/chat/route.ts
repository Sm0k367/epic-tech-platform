import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { getSystemPrompt } from "@/lib/groq-prompt";

// Types
interface ChatRequest {
  message?: string;
  systemPrompt?: string;
}

interface ErrorResponse {
  error: string;
  status: number;
  timestamp: string;
}

// Initialize Groq client
let groqClient: Groq | null = null;

function getGroqClient(): Groq {
  if (!groqClient) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY environment variable is not set");
    }
    groqClient = new Groq({ apiKey });
  }
  return groqClient;
}

/**
 * POST /api/chat
 * 
 * Accepts a user message and optional system prompt, streams response from Groq API.
 * 
 * Request body:
 * {
 *   "message": "user prompt",
 *   "systemPrompt": "optional system context"
 * }
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const timestamp = new Date().toISOString();

  try {
    // Parse request body
    const body = (await request.json()) as ChatRequest;
    const { message, systemPrompt } = body;

    // Validate input
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      console.warn(`[${timestamp}] Invalid chat request: empty message`);
      const errorResponse: ErrorResponse = {
        error: "Message is required and must be a non-empty string",
        status: 400,
        timestamp,
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Log request
    console.log(`[${timestamp}] Chat request received:`, {
      messageLength: message.length,
      hasSystemPrompt: !!systemPrompt,
    });

    // Get Groq client
    const client = getGroqClient();

    // Prepare messages
    const messages: Groq.Chat.ChatCompletionMessageParam[] = [];

    // Add system prompt (use provided or default to creative advisor)
    const finalSystemPrompt = systemPrompt || getSystemPrompt();
    messages.push({
      role: "system",
      content: finalSystemPrompt,
    });

    // Add user message
    messages.push({
      role: "user",
      content: message,
    });

    // Call Groq API
    const response = await client.chat.completions.create({
      model: "mixtral-8x7b-32768",
      messages: messages,
      max_tokens: 1024,
      temperature: 0.7,
    });

    // Extract response content
    const content =
      response.choices[0]?.message?.content ||
      "Unable to generate a response. Please try again.";

    console.log(`[${timestamp}] Chat response generated:`, {
      contentLength: (content as string).length,
      tokensUsed: response.usage?.total_tokens,
    });

    // Return response
    return NextResponse.json(
      {
        response: content,
        usage: response.usage,
        model: response.model,
        timestamp,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error(`[${timestamp}] Chat API error:`, {
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });

    const errorResponse: ErrorResponse = {
      error: `Failed to process chat request: ${errorMessage}`,
      status: 500,
      timestamp,
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

/**
 * GET /api/chat
 * 
 * Health check endpoint
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    {
      status: "ok",
      endpoint: "POST /api/chat with { message: string, systemPrompt?: string }",
      model: "mixtral-8x7b-32768",
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}
