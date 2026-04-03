// app/api/user/order/route.ts (Add only required changes)
import connectDB from "@/lib/db";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto"; // Add this import

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { userId, items, paymentMethod, totalAmount, address, razorpayOrderId, razorpayPaymentId, razorpaySignature } = await request.json();
    
    if (!userId || !items || !paymentMethod || !totalAmount || !address) {
      return NextResponse.json(
        { message: "Please send all required fields" },
        { status: 400 }
      );
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    }
    
    // Add payment verification for online payments
    if (paymentMethod === "Online") {
      if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
        return NextResponse.json(
          { message: "Missing payment verification details" },
          { status: 400 }
        );
      }
      
      // Verify signature
      const bodyText = razorpayOrderId + "|" + razorpayPaymentId;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_API_SECRET!)
        .update(bodyText)
        .digest("hex");
      
      if (expectedSignature !== razorpaySignature) {
        return NextResponse.json(
          { message: "Invalid payment signature" },
          { status: 400 }
        );
      }
    }
    
    const newOrder = await Order.create({
      user: userId,
      items,
      paymentMethod,
      totalAmount,
      address,
      isPaid: paymentMethod === "Online" ? true : false,
      razorpayOrderId: razorpayOrderId || null,
      razorpayPaymentId: razorpayPaymentId || null,
    });
    
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: `place order failed ${error}` },
      { status: 500 }
    );
  }
}