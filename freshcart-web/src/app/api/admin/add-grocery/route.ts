import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinary";
import connectDB from "@/lib/db";
import Grocery from "@/models/grocery.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return NextResponse.json(
        {
          message: "You are not authorized to perform this action",
        },
        { status: 400 },
      );
    }
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const price = formData.get("price") as string;
    const unit = formData.get("unit") as string;
    const file = formData.get("image") as Blob | null;
    let imageUrl;
    if (file) {
      imageUrl = await uploadOnCloudinary(file);
    }
    const grocery = await Grocery.create({
      name,
      category,
      price,
      unit,
      image: imageUrl,
    });
    return NextResponse.json(
      {
        message: "Grocery added successfully",
        grocery,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: `grocery addition failed: ${error}`,
      },
      { status: 500 },
    );
  }
}
