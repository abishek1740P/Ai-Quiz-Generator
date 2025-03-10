import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@/utils/db";
import User from "@/models/User";

export async function POST(req) {
  await connectDB(); // Ensure DB is connected

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 }); // Generic message
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 }); // Generic message
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return NextResponse.json(
      {
        message: "Login successful",
        token,
        user: { username: user.username }, // ✅ Only expose username, not email/password
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error logging in"); // ✅ Log minimal details
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
