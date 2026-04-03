"use client";

import Image from "next/image";
import { useState } from "react";
import { ShoppingCart, Check, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  addToCart,
  decreaseQuantity,
  increaseQuantity,
} from "@/redux/cartSlice";
import mongoose from "mongoose";

interface IGrocery {
  _id: mongoose.Types.ObjectId;
  name: string;
  category: string;
  price: number;
  unit: string;
  image?: string;
}

interface GroceryItemCardProps {
  item: IGrocery;
}

function GroceryItemCard({ item }: GroceryItemCardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { cartData } = useSelector((state: RootState) => state.cart);
  const cartItem = cartData.find((i) => i._id.toString() === item._id.toString());

  const [isAdded, setIsAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ duration: 0.3 }}
      className="group bg-white dark:bg-[#1e293b] rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative h-40 sm:h-44 md:h-48 w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 overflow-hidden">
        <motion.div
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative w-full h-full"
        >
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-contain p-3"
              sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, 20vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <ShoppingCart className="w-10 h-10 text-slate-300 dark:text-slate-600" />
            </div>
          )}
        </motion.div>

        {/* Category Badge - Top Left */}
        <div className="absolute top-2 left-2">
          <span className="text-[10px] font-medium text-blue-600 dark:text-blue-400 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full px-2 py-1 shadow-sm">
            {item.category}
          </span>
        </div>

        {/* Unit Badge - Bottom Right */}
        <div className="absolute bottom-2 right-2">
          <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full px-2 py-1 shadow-sm">
            {item.unit}
          </span>
        </div>

        {/* Shine Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
          initial={{ x: "-100%" }}
          animate={{ x: isHovered ? "100%" : "-100%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4">
        {/* Name */}
        <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2 min-h-[40px] sm:min-h-[48px] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {item.name}
        </h3>

        {/* Price and Counter Row */}
        <div className="flex items-center justify-between gap-2">
          {/* Price */}
          <div className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400">
            ₹{item.price}
          </div>

          {/* Action Button */}
          <AnimatePresence mode="wait">
            {!cartItem ? (
              <motion.button
                key="add"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  dispatch(addToCart({ ...item, quantity: 1 }));
                  setIsAdded(true);
                  setTimeout(() => setIsAdded(false), 1500);
                }}
                className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white text-xs sm:text-sm font-medium rounded-full transition-all flex items-center justify-center gap-1 shadow-sm"
              >
                {isAdded ? (
                  <>
                    <Check size={14} />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={14} />
                    <span>ADD</span>
                  </>
                )}
              </motion.button>
            ) : (
              <motion.div
                key="counter"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-1 border border-slate-200 dark:border-slate-700 rounded-full bg-white dark:bg-[#1e293b] shadow-sm px-1 py-0.5"
              >
                <button
                  onClick={() => dispatch(decreaseQuantity(item._id))}
                  className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 flex items-center justify-center transition-all"
                >
                  <Minus size={12} />
                </button>

                <motion.span
                  key={cartItem.quantity}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="min-w-[24px] text-center font-semibold text-slate-900 dark:text-white text-sm"
                >
                  {cartItem.quantity}
                </motion.span>

                <button
                  onClick={() => dispatch(increaseQuantity(item._id))}
                  className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 flex items-center justify-center transition-all"
                >
                  <Plus size={12} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating Particles on Hover */}
      <AnimatePresence>
        {isHovered && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-400 rounded-full pointer-events-none"
                initial={{
                  x: Math.random() * 200 + 50,
                  y: Math.random() * 250 + 100,
                  scale: 0,
                  opacity: 0.6,
                }}
                animate={{
                  y: [null, -50],
                  x: [null, Math.random() * 80 - 40],
                  scale: [0, 1, 0],
                  opacity: [0.6, 0.6, 0],
                }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 1.5,
                  ease: "easeOut",
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default GroceryItemCard;