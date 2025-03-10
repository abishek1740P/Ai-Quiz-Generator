
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Score from "@/models/Score";

export async function POST(req) {
  try {
    await dbConnect(); // ✅ Connect to MongoDB

    const { scoreId } = await req.json();
    if (!scoreId) {
      return NextResponse.json({ error: "Missing scoreId" }, { status: 400 });
    }

    // ✅ Fetch user email & quiz report from DB
    const score = await Score.findById(scoreId).populate("userId"); // Assuming `userId` stores user email
    if (!score || !score.userId) {
      return NextResponse.json({ error: "Score not found" }, { status: 404 });
    }

    const { userId, topic, difficulty, score: userScore, dateTime, report } = score;
    const userEmail = userId.email;

    // ✅ Format Date & Time
    const formattedDateTime = new Date(score.createdAt).toLocaleString("en-US", {
      timeZone: "Asia/Kolkata", 
      weekday: "long", 
      year: "numeric",
      month: "long", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit", 
      hour12: true, 
    });
    

    // ✅ Generate HTML Email Report
    const reportHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>📜 Your Quiz Report</h2>
        <p><strong>📌 Topic:</strong> ${topic}</p>
        <p><strong>📊 Difficulty:</strong> ${difficulty}</p>
        <p><strong>🎯 Score:</strong> ${userScore}</p>
        <p><strong>⏳ Date & Time:</strong> ${formattedDateTime}</p>
        
        <h3>📋 Questions & Answers:</h3>
        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;">
          <thead>
            <tr>
              <th>#</th>
              <th>Question</th>
              <th>Correct Answer</th>
              <th>Your Answer</th>
            </tr>
          </thead>
          <tbody>
            ${report
              .map(
                (q, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${q.question}</td>
                  <td>${q.correctAnswer}</td>
                  <td style="color: ${q.chosenAnswer === q.correctAnswer ? "green" : "red"}">
                    ${q.chosenAnswer || "Not Answered"}
                  </td>
                </tr>
              `
              )
              .join("")}
          </tbody>
        </table>

        <p>Thank you for using our quiz platform! 🚀</p>
      </div>
    `;

    // ✅ Configure Nodemailer for Zoho Mail
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.in",
      port: 465, 
      secure: true,
      auth: {
        user: process.env.SMTP_EMAIL, 
        pass: process.env.SMTP_PASSWORD, 
      },
    });

    // ✅ Email Options
    const mailOptions = {
      from: `"Quiz Platform" <${process.env.SMTP_EMAIL}>`,
      to: userEmail,
      subject: "📩 Your Quiz Report",
      html: reportHtml,
    };

    // ✅ Send Email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: "Email sent successfully!" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
