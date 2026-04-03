// app/api/user/razorpay-webhook/route.ts
import connectDB from "@/lib/db";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    // Only verify if webhook secret is set (production)
    if (process.env.RAZORPAY_WEBHOOK_SECRET) {
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
        .update(body)
        .digest("hex");

      if (signature !== expectedSignature) {
        return NextResponse.json(
          { message: "Invalid signature" },
          { status: 400 }
        );
      }
    }

    const event = JSON.parse(body);

    // Handle payment captured event
    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;

      // Find and update order
      const order = await Order.findOne({ razorpayOrderId: orderId });
      
      if (order && !order.isPaid) {
        order.isPaid = true;
        order.status = "Pending";
        order.razorpayPaymentId = payment.id;
        await order.save();
        console.log(`Order ${order._id} payment confirmed`);
      }
    }

    return NextResponse.json({ received: true });

  } catch (err: any) {
    console.error("Webhook error:", err);
    return NextResponse.json(
      { message: err.message },
      { status: 500 }
    );
  }
}