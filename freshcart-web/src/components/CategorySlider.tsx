"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import {
  Milk,
  Egg,
  Wheat,
  Cookie,
  Coffee,
  Flame,
  Heart,
  Home,
  ShoppingBag,
  Leaf,
} from "lucide-react";

function CategorySlider() {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [isHovered, setIsHovered] = useState(false);

  // Categories data
  const originalCategories = [
    {
      id: 1,
      name: "Dairy & Eggs",
      mainIcon: <Milk className="w-5 h-5" />,
      secondaryIcon: <Egg className="w-5 h-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      id: 2,
      name: "Rice, Atta & Grains",
      mainIcon: <Wheat className="w-5 h-5" />,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
    {
      id: 3,
      name: "Snacks & Biscuits",
      mainIcon: <Cookie className="w-5 h-5" />,
      color: "text-pink-600",
      bgColor: "bg-pink-100",
    },
    {
      id: 4,
      name: "Spices & Masalas",
      mainIcon: <Flame className="w-5 h-5" />,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      id: 5,
      name: "Beverages & Drinks",
      mainIcon: <Coffee className="w-5 h-5" />,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      id: 6,
      name: "Personal Care",
      mainIcon: <Heart className="w-5 h-5" />,
      color: "text-rose-600",
      bgColor: "bg-rose-100",
    },
    {
      id: 7,
      name: "Household Essentials",
      mainIcon: <Home className="w-5 h-5" />,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
  ];

  // Create seamless loop by duplicating categories
  const categories = [
    ...originalCategories,
    ...originalCategories,
    ...originalCategories,
    ...originalCategories,
  ];

  // Calculate total width for seamless scroll
  const cardWidth = 176; // w-44 = 176px
  const gap = 20; // gap-5 = 20px
  const totalWidth = (cardWidth + gap) * originalCategories.length;

  // Start animation when in view
  useEffect(() => {
    if (isInView && !isHovered) {
      controls.start({
        x: [-totalWidth, -totalWidth * 2],
        transition: {
          duration: 30,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        },
      });
    } else {
      controls.stop();
    }
  }, [controls, isInView, isHovered, totalWidth]);

  return (
    <div className="w-full bg-slate-50 dark:bg-[#020617] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="relative">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <ShoppingBag className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
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
            Shop by Category
          </h2>
          
          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
            Browse your favorite items
          </p>
        </div>

        {/* Carousel Container */}
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Gradient Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 bg-gradient-to-r from-slate-50 to-transparent dark:from-[#020617] z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 bg-gradient-to-l from-slate-50 to-transparent dark:from-[#020617] z-10 pointer-events-none"></div>

          {/* Cards Container */}
          <div className="overflow-hidden">
            <motion.div
              ref={ref}
              animate={controls}
              className="flex gap-3 sm:gap-5"
              style={{ width: "fit-content", x: 0 }}
            >
              {categories.map((category, index) => (
                <motion.div
                  key={`${category.id}-${index}`}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0 w-36 xs:w-40 sm:w-44"
                >
                  <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
                    <div className="p-3 sm:p-5 flex flex-col items-center">
                      <div
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full ${category.bgColor} dark:bg-opacity-20 flex items-center justify-center mb-2 sm:mb-3`}
                      >
                        <div className={`flex gap-1.5 ${category.color} dark:opacity-90`}>
                          {category.mainIcon}
                          {category.secondaryIcon}
                        </div>
                      </div>
                      <h3 className="text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 text-center leading-tight">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategorySlider;