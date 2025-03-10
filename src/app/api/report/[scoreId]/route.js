// import { NextResponse } from "next/server";
// import connectDB from "@/utils/db";
// import Score from "@/models/Score";
// import User from "@/models/User";
// import jwt from "jsonwebtoken";

// // ✅ Authenticate User Function
// async function authenticateUser(req) {
//   const authHeader = req.headers.get("authorization");
//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return { error: "Unauthorized", status: 401 };
//   }

//   const token = authHeader.split(" ")[1];
//   let decoded;
//   try {
//     decoded = jwt.verify(token, process.env.JWT_SECRET);
//   } catch {
//     return { error: "Invalid or expired token", status: 401 };
//   }

//   const user = await User.findById(decoded.userId);
//   if (!user) {
//     return { error: "User not found", status: 404 };
//   }

//   return { user };
// }

// // ✅ GET Report for a Specific Quiz
// export async function GET(req, { params }) {
//   await connectDB();

//   try {
//     const { user, error, status } = await authenticateUser(req);
//     if (error) return NextResponse.json({ message: error }, { status });

//     // 🔹 Extract scoreId correctly
//     const { scoreId } = params; // ✅ This should match the dynamic route `[scoreId].js`

    

//     if (!scoreId) {
//       return NextResponse.json({ message: "Missing scoreId parameter" }, { status: 400 });
//     }

//     // 🔹 Find the Score by ID & User ID
//     const score = await Score.findOne({ _id: scoreId, userId: user._id }).lean();

//     if (!score) {
      
//       return NextResponse.json({ message: "Score not found" }, { status: 404 });
//     }

   

//     return NextResponse.json({ report: score.report || [] }, { status: 200 });
//   } catch (error) {
 
//     return NextResponse.json({ message: "Server error" }, { status: 500 });
//   }
// }



import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Score from "@/models/Score";
import User from "@/models/User";
import jwt from "jsonwebtoken";

// ✅ Authenticate User Function
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

// ✅ Corrected API route
export async function GET(req, context) {
  await connectDB();

  try {
    const { user, error, status } = await authenticateUser(req);
    if (error) return NextResponse.json({ message: error }, { status });

    // ✅ Await params before using
    const { params } = context;
    const scoreId = await params.scoreId; // ⬅ Await params to avoid warning

    if (!scoreId) {
      return NextResponse.json({ message: "Missing scoreId parameter" }, { status: 400 });
    }

    // ✅ Find the Score by ID & User ID
    const score = await Score.findOne({ _id: scoreId, userId: user._id }).lean();

    if (!score) {
      return NextResponse.json({ message: "Score not found" }, { status: 404 });
    }

    return NextResponse.json({ report: score.report || [] }, { status: 200 });
  } catch (error) {
    console.error("Error fetching report:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
