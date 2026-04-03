"use client";

import { motion } from "framer-motion";
import { Apple, Leaf } from "lucide-react";
import GroceryItemCard from "./GroceryItemCard";
import mongoose from "mongoose";

interface IGrocery {
  _id: mongoose.Types.ObjectId;
  name: string;
  category: string;
  price: number;
  unit: string;
  image?: string;
  timer?: string;
}

interface PopularGroceriesProps {
  groceries: IGrocery[];
}

export default function PopularGroceries({ groceries }: PopularGroceriesProps) {
  return (
    <div className="bg-slate-50 dark:bg-[#020617] py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="relative">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Apple className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
              </div>
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: "easeInOut",
                }}
                className="absolute -top-1 -right-1"
              >
                <Leaf size={16} className="text-green-600" />
              </motion.div>
            </div>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Popular Groceries
          </h2>
          
          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
            Most loved products this week
          </p>
        </div>

        {/* Grid - Updated to show 6 cards in one row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {groceries.map((item: IGrocery, index: number) => (
            <motion.div
              key={item._id.toString()}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.05,
                duration: 0.4,
                ease: "easeOut",
              }}
            >
              <GroceryItemCard item={item} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}