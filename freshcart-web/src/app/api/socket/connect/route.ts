import connectDB from "@/lib/db";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

export async function POST(Request: NextResponse) {
  try {
    await connectDB();
    const { userId, socketId } = await Request.json();
    const user = await User.findByIdAndUpdate(
      userId,
      { socketId, isOnline: true },
      { new: true },
    );
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 400 },
      );
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to connect" },
      { status: 500 },
    );
  }
}
