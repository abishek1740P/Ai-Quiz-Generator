import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import connectDB from "@/utils/db";

export async function POST(req) {
  await connectDB();

  try {
    const { topic, difficulty, count } = await req.json();

    if (!topic || !difficulty || !count || isNaN(count) || count <= 0) {
      return NextResponse.json(
        { error: "Valid topic, difficulty, and count are required." },
        { status: 400 }
      );
    }

    const API_KEY = process.env.GOOGLE_API_KEY;
    if (!API_KEY) {
      return NextResponse.json(
        { error: "Server configuration error: Missing API key." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Generate a ${difficulty} level multiple-choice quiz on ${topic} with ${count} questions.
      Response must be a **valid JSON array** in the following format:
      [
        {
          "question": "What is the capital of France?",
          "options": ["Berlin", "Madrid", "Paris", "Rome"],
          "answer": "Paris"
        }
      ]
      Do NOT include Markdown formatting (\`\`\`json or \`\`\`).
      Return ONLY valid JSON. No explanations, no extra text.
    `;

    const result = await model.generateContent(prompt);
    let textResponse = await result.response.text();

    textResponse = textResponse.trim();
    if (textResponse.startsWith("```json")) {
      textResponse = textResponse.replace(/```json/, "").replace(/```/, "").trim();
    }

    let quizData;
    try {
      quizData = JSON.parse(textResponse);
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON format received from AI service." },
        { status: 500 }
      );
    }

    if (!Array.isArray(quizData) || quizData.length !== count) {
      return NextResponse.json(
        { error: "Incomplete or incorrect quiz data received." },
        { status: 500 }
      );
    }

    return NextResponse.json({ quiz: quizData });
  } catch {
    return NextResponse.json(
      { error: "Quiz generation failed due to an internal error." },
      { status: 500 }
    );
  }
}
