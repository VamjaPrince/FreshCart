import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(Request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
   if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const orders = await Order.find({
      user: session.user.id,
    }).populate("user");

    if (!orders || orders.length === 0) {
      return NextResponse.json(
        { message: "No orders found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `get orders failed ${error}` },
      { status: 500 },
    );
  }
}
