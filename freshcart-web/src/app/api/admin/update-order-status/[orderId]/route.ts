import connectDB from "@/lib/db";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  Request: NextRequest,
  { params }: { params: { orderId: string } },
) {
  try {
    await connectDB();
    const { orderId } = await params;
    const { status } = await Request.json();
    const order = await Order.findById(orderId).populate("user");
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 400 });
    }
    order.status = status;
    let availableDeliveryBoys = [];
        if (status === "Out for Delivery" && !order.assignment) {
        // Find delivery    
        availableDeliveryBoys = await User.find({ role: "deliveryBoy" });

        }
  } catch (error) {}
}
