"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import {
  ShoppingBasket,
  Apple,
  Carrot,
  Milk,
  Timer,
  Sparkles,
  ArrowRight,
  Coffee,
  Leaf,
} from "lucide-react";

type propType = {
  nextStep: (s: number) => void;
};

export default function Welcome({ nextStep }: propType) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 16, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.9,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-slate-50 dark:bg-[#020617]">
      {/* Soft background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[360px] h-[360px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-0 -right-32 w-[360px] h-[360px] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-32 left-32 w-[360px] h-[360px] bg-sky-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Floating Icons - Responsive positioning */}
      <motion.div
        animate={{
          y: [0, -12, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-12 left-[8%] sm:top-16 sm:left-[10%] md:top-20 md:left-[12%] text-blue-300/50"
      >
        <Apple
          size={28}
          className="sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10"
        />
      </motion.div>

      <motion.div
        animate={{
          y: [0, -15, 0],
          rotate: [0, -8, 8, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
        className="absolute top-20 right-[8%] sm:top-24 sm:right-[10%] md:top-32 md:right-[15%] text-indigo-300/50"
      >
        <Carrot
          size={28}
          className="sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10"
        />
      </motion.div>

      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: [0, 6, -6, 0],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-32 left-[8%] sm:bottom-36 sm:left-[12%] md:bottom-40 md:left-[18%] text-amber-300/50"
      >
        <Coffee
          size={26}
          className="sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9"
        />
      </motion.div>

      <motion.div
        animate={{
          y: [0, -14, 0],
          rotate: [0, -4, 4, 0],
        }}
        transition={{
          duration: 6.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.2,
        }}
        className="absolute bottom-24 right-[8%] sm:bottom-28 sm:right-[12%] md:bottom-32 md:right-[18%] text-blue-300/50"
      >
        <Milk
          size={28}
          className="sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10"
        />
      </motion.div>

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative h-full flex flex-col items-center justify-center px-4 sm:px-6 md:px-8"
      >
        {/* Logo */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-2 sm:gap-3 mb-5 sm:mb-6 md:mb-7"
        >
          <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-blue-600 shadow-sm">
            <div className="absolute inset-0 rounded-full ring-2 ring-blue-400/30" />
            <ShoppingBasket className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <span className="text-xl sm:text-2xl md:text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Freshcart
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div
          variants={itemVariants}
          className="text-center max-w-xs sm:max-w-lg md:max-w-2xl mx-auto"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-semibold leading-tight text-slate-900 dark:text-slate-100">
            Your one-stop destination for
            <span className="block mt-1 sm:mt-2 text-blue-600 dark:text-blue-400">
              fresh groceries & daily essentials
            </span>
          </h1>

          {/* Feature Tags */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-1.5 sm:gap-2 md:gap-2.5 my-4 sm:my-5 md:my-6"
          >
            {[
              {
                icon: Timer,
                text: "10-minute delivery",
                style:
                  "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
              },
              {
                icon: Leaf,
                text: "Organic produce",
                style:
                  "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
              },
              {
                icon: Sparkles,
                text: "Farm fresh",
                style:
                  "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300",
              },
            ].map((tag, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.4 }}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium ${tag.style}`}
              >
                <tag.icon size={12} className="sm:w-3.5 sm:h-3.5" />
                {tag.text}
              </motion.div>
            ))}
          </motion.div>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-6 sm:mb-7 md:mb-8 max-w-xs sm:max-w-md md:max-w-lg mx-auto px-2 sm:px-0"
          >
            Get fruits, vegetables and daily essentials delivered reliably to
            your doorstep — fast, fresh and hassle-free.
          </motion.p>

          {/* CTA */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <button
              className="group px-5 sm:px-6 md:px-7 py-2 sm:py-2.5 md:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs sm:text-sm font-medium shadow-md transition flex items-center gap-1.5 sm:gap-2 mx-auto cursor-pointer"
              onClick={() => nextStep(2)}
            >
              Continue
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </motion.div>

          {/* Footer */}
          <motion.p
            variants={itemVariants}
            className="text-[10px] sm:text-[11px] text-slate-400 mt-4 sm:mt-5 md:mt-6 tracking-wide"
          >
            Fresh • Reliable • Fast
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}
