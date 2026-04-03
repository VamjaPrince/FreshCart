// app/api/user/razorpay-payment/route.ts
import connectDB from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY!,
  key_secret: process.env.RAZORPAY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { userId, totalAmount } = await req.json();

    // Validation
    if (!userId || !totalAmount) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 400 }
      );
    }

    // Create Razorpay Order ONLY
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return NextResponse.json({
      success: true,
      order: razorpayOrder,
    });

  } catch (err: any) {
    console.error("Razorpay order creation error:", err);
    return NextResponse.json(
      { message: err.message || "Failed to create Razorpay order" },
      { status: 500 }
    );
  }
}