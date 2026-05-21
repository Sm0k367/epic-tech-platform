import { NextResponse } from "next/server";
import { testGroqConnection } from "@/lib/groq-client";

export async function GET() {
  try {
    const result = await testGroqConnection("Briefly introduce yourself as a helpful AI creative assistant for the Epic Platform studio.");
    
    if (result.success) {
      return NextResponse.json({
        status: "success",
        message: "Groq API connection successful",
        response: result.response,
      });
    } else {
      return NextResponse.json(
        {
          status: "error",
          message: "Groq API connection failed",
          error: result.error,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
