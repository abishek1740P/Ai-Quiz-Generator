
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { topic, difficulty, count } = await req.json();

    if (!topic || !difficulty || !count || isNaN(count) || count <= 0) {
      return Response.json({ error: "Valid topic, difficulty, and count are required." }, { status: 400 });
    }

    if (!process.env.GOOGLE_API_KEY) {
      return Response.json({ error: "Missing GOOGLE_API_KEY." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Strict JSON formatting to avoid markdown artifacts
    const prompt = `
      Generate a ${difficulty} level multiple-choice quiz on ${topic} with ${count} questions.
      The response should be a **valid JSON array** in the following format:
      [
        {
          "question": "What is the capital of France?",
          "options": ["Berlin", "Madrid", "Paris", "Rome"],
          "answer": "Paris"
        }
      ]
      DO NOT include Markdown formatting (e.g., \`\`\`json or \`\`\`).
      ONLY return valid JSON, no explanations.
    `;

    console.log(`Requesting ${count} questions from Gemini API...`);

    const result = await model.generateContent(prompt);
    let textResponse = await result.response.text();

    // Ensure it is valid JSON
    textResponse = textResponse.trim();
    if (textResponse.startsWith("```json")) {
      textResponse = textResponse.replace(/```json/, "").replace(/```/, "").trim();
    }

    const quizData = JSON.parse(textResponse);

    if (!Array.isArray(quizData) || quizData.length !== count) {
      throw new Error("Invalid or incomplete quiz data received from Gemini API.");
    }

    console.log(`Quiz with ${count} questions successfully generated.`);

    return Response.json({ quiz: quizData });
  } catch (error) {
    console.error("Quiz generation failed:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
