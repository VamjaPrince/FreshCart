import HeroSection from "./HeroSection";
import CategorySlider from "./CategorySlider";
import connectDB from "@/lib/db";
import Grocery from "@/models/grocery.model";
import PopularGroceries from "./PopularGroceries";
import mongoose from "mongoose";

interface IGrocery {
  _id: mongoose.Types.ObjectId;
  name: string;
  category: string;
  price: number;
  unit: string;
  image?: string;
}

async function UserDashboard() {
  await connectDB();
  const groceries = await Grocery.find({}).lean();
  const plainGroceries: IGrocery[] = JSON.parse(JSON.stringify(groceries));

  return (
    <>
      <div>
        <HeroSection />
        <CategorySlider />
        <PopularGroceries groceries={plainGroceries} />
      </div>
    </>
  );
}

export default UserDashboard;