// Code to handle the POST and GET requests for scores


import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/utils/db";
import Score from "@/models/Score";
import User from "@/models/User";
import Report from "@/models/Report";

// ✅ Function to authenticate and return the user
async function authenticateUser(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: "Unauthorized", status: 401 };
  }

  const token = authHeader.split(" ")[1];
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return { error: "Invalid or expired token", status: 401 };
  }

  const user = await User.findById(decoded.userId);
  if (!user) {
    return { error: "User not found", status: 404 };
  }

  return { user };
}

// ✅ POST method to save the score & report
// ✅ POST method to save the score & report
export async function POST(req) {
  await connectDB();

  try {
    const { user, error, status } = await authenticateUser(req);
    if (error) return NextResponse.json({ message: error }, { status });

    // 🔹 Read and log the request body
    const body = await req.json();
   

    const { topic, difficulty, score, total, report } = body;

    // 🔹 Check if all required fields are present
    if (!topic || !difficulty || score == null || total == null || !report) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const formattedDifficulty = difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();

    const newScore = new Score({
      userId: user._id,
      username: user.username,
      topic,
      difficulty: formattedDifficulty,
      score,
      total,
      report,
    });

    await newScore.save();

    // ✅ Return the saved score ID along with the message
    return NextResponse.json({ 
      message: "Score saved successfully", 
      scoreId: newScore._id  // Return the score ID
    }, { status: 201 });
    
  } catch (error) {
  
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}




// ✅ GET method to retrieve user scores with report links
export async function GET(req) {
  await connectDB();

  try {
    const { user, error, status } = await authenticateUser(req);
    if (error) return NextResponse.json({ message: error }, { status });

    // 🔹 Fetch scores and include `scoreId` for report retrieval
    const scores = await Score.find({ userId: user._id })
      .sort({ createdAt: -1 });

    const formattedScores = scores.map((score) => ({
      _id: score._id, // ✅ Send scoreId to fetch report later
      topic: score.topic,
      difficulty: score.difficulty,
      score: score.score,
      total: score.total,
      percentage: ((score.score / score.total) * 100).toFixed(2),
      createdAt: score.createdAt,
    }));

    return NextResponse.json({ scores: formattedScores }, { status: 200 });
  } catch (error) {
   
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}


