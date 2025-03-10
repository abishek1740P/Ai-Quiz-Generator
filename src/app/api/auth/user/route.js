// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";
// import connectDB from "@/utils/db";
// import User from "@/models/User";

// export async function GET(req) {
//   await connectDB();

//   try {
//     const authHeader = req.headers.get("authorization");
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       console.warn("Missing or malformed token"); // ✅ Debugging
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const token = authHeader.split(" ")[1];
   

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
   
//     const user = await User.findById(decoded.userId).select("-password");
//     if (!user) {
     
//       return NextResponse.json({ message: "User not found" }, { status: 404 });
//     }

//     return NextResponse.json({ user }, { status: 200 });
//   } catch (error) {
//     console.erroar("Token verification failed:", error.message);
//     return NextResponse.json({ message: "Invalid token" }, { status: 401 });
//   }
// }




import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/utils/db";
import User from "@/models/User";

export async function GET(req) {
  await connectDB();

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.warn("❌ Missing or malformed token");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    // ✅ Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        console.error("❌ Token expired");
        return NextResponse.json({ message: "Token expired" }, { status: 401 });
      }
      console.error("❌ Token verification failed:", error.message);
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    if (!decoded.userId) {
      console.error("❌ Invalid token payload: Missing userId");
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // ✅ Fetch the user from DB
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      console.warn("❌ User not found for userId:", decoded.userId);
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("❌ Unexpected error:", error.message);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
