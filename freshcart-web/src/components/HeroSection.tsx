"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf,
  Truck,
  Apple,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Award,
  Clock,
} from "lucide-react";
import { getSocket } from "@/lib/socket";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const slides = [
  {
    id: 1,
    image:
      "https://images.pexels.com/photos/7890010/pexels-photo-7890010.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    badge: "Farm Fresh Vegetables",
    badgeIcon: <Leaf className="h-4 w-4 text-green-500" />,
    title: "Fresh Vegetables",
    highlight: "Straight from Farms",
    description:
      "Daily-harvested vegetables sourced directly from trusted local farmers. No chemicals, no storage — just pure freshness.",
    trust1: "Chemical Free",
    trust2: "Daily Harvest",
    trustIcon1: <Leaf className="h-4 w-4 text-green-500" />,
    trustIcon2: <Truck className="h-4 w-4 text-green-500" />,
    bgGradient: "from-green-500/25 to-emerald-500/25",
  },

  {
    id: 2,
    image:
      "https://images.pexels.com/photos/5677917/pexels-photo-5677917.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    badge: "Seasonal Fruits",
    badgeIcon: <Apple className="h-4 w-4 text-red-500" />,
    title: "Juicy Fruits",
    highlight: "Naturally Sweet",
    description:
      "Handpicked seasonal fruits from verified orchards. Fresh, juicy, and rich in natural taste — delivered at peak ripeness.",
    trust1: "Orchard Fresh",
    trust2: "Premium Quality",
    trustIcon1: <Apple className="h-4 w-4 text-red-500" />,
    trustIcon2: <Sparkles className="h-4 w-4 text-red-500" />,
    bgGradient: "from-red-500/25 to-orange-500/25",
  },

  {
    id: 3,
    image:
      "https://images.pexels.com/photos/7363190/pexels-photo-7363190.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    badge: "Lightning Fast Delivery",
    badgeIcon: <Truck className="h-4 w-4 text-blue-500" />,
    title: "Quick Delivery",
    highlight: "In 30 Minutes",
    description:
      "Groceries delivered to your doorstep in just 30 minutes. Live tracking, safe packaging, and zero delivery stress.",
    trust1: "Live Tracking",
    trust2: "Contactless Delivery",
    trustIcon1: <Clock className="h-4 w-4 text-blue-500" />,
    trustIcon2: <ShieldCheck className="h-4 w-4 text-blue-500" />,
    bgGradient: "from-blue-500/25 to-cyan-500/25",
  },

  {
    id: 4,
    image:
      "https://indian-retailer.s3.ap-south-1.amazonaws.com/s3fs-public/2021-06/beautiful-tasty-appetizing-ingredients-spices-grocery-cooking-healthy-kitchen-blue-old-wooden-background-top-view.jpg?w=1920&h=1080&fit=crop",
    badge: "Daily Grocery Essentials",
    badgeIcon: <ShoppingBag className="h-4 w-4 text-purple-500" />,
    title: "Daily Essentials",
    highlight: "Best Value Prices",
    description:
      "From dairy, grains, snacks to household needs — everything you use daily at affordable prices with quality assurance.",
    trust1: "Best Price Guarantee",
    trust2: "Quality Checked",
    trustIcon1: <Award className="h-4 w-4 text-purple-500" />,
    trustIcon2: <ShieldCheck className="h-4 w-4 text-purple-500" />,
    bgGradient: "from-purple-500/25 to-pink-500/25",
  },
];

export default function Hero() {
  const { userData } = useSelector((state: RootState) => state.user);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (userData) {
      const socket = getSocket();
      socket.emit("identity", userData?._id);
    }
  }, [userData]); 

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="relative h-[500px] w-full overflow-hidden rounded-2xl bg-white dark:bg-[#0f1729] shadow-xl border border-slate-200 dark:border-slate-800">
        {/* Background Image with Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={slides[current].image}
              alt={slides[current].title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
              quality={100}
            />
          </motion.div>
        </AnimatePresence>

        {/* Gradient Overlay - Matching NavBar style */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent dark:from-[#0f1729]/90 dark:via-[#0f1729]/60" />

        {/* Content with Animation */}
        <div className="relative z-10 flex h-full items-center px-6 md:px-12 lg:px-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-xl"
            >
              {/* Badge - Matching NavBar pill style */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 dark:bg-slate-800/50 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white border border-white/20 dark:border-slate-700"
              >
                {slides[current].badgeIcon}
                <span>{slides[current].badge}</span>
              </motion.div>

              {/* Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white"
              >
                {slides[current].title}
                <br />
                <span className="text-blue-400 dark:text-blue-400">
                  {slides[current].highlight}
                </span>
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 text-slate-200 text-sm md:text-base max-w-lg"
              >
                {slides[current].description}
              </motion.p>

              {/* CTA Buttons - Matching NavBar button style */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-8 flex flex-wrap gap-4"
              >
                <button className="rounded-full bg-blue-600 hover:bg-blue-700 px-8 py-3 text-sm font-semibold text-white transition-all transform hover:scale-105 shadow-lg">
                  Shop Now
                </button>
                <button className="rounded-full bg-white/10 backdrop-blur-sm border border-white/30 hover:bg-white/20 px-8 py-3 text-sm font-semibold text-white transition-all transform hover:scale-105">
                  Explore Categories
                </button>
              </motion.div>

              {/* Trust Indicators - Matching NavBar style */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-8 flex items-center gap-6"
              >
                <div className="flex items-center gap-2 text-sm text-slate-200">
                  <span className="p-1.5 rounded-full bg-white/10 backdrop-blur-sm">
                    {slides[current].trustIcon1}
                  </span>
                  <span>{slides[current].trust1}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-200">
                  <span className="p-1.5 rounded-full bg-white/10 backdrop-blur-sm">
                    {slides[current].trustIcon2}
                  </span>
                  <span>{slides[current].trust2}</span>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slider Dots - Matching NavBar style */}
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-3">
          {slides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrent(index)}
              className="group relative"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <span
                className={`block h-2 rounded-full transition-all duration-300 ${
                  current === index
                    ? "w-8 bg-blue-500 dark:bg-blue-400"
                    : "w-2 bg-white/50 group-hover:bg-white/80"
                }`}
              />
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
