"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Package, Leaf, ArrowRight, ShoppingBag, ArrowLeft } from "lucide-react";

function OrderSuccess() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    // Handle window resize
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#020617] relative overflow-hidden flex items-center justify-center">
      
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => (window.location.href = "/")}
        className="fixed top-6 left-6 z-50 inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft size={18} />
        <span className="text-sm font-medium">Back to Home</span>
      </motion.button>

      {/* Enhanced Physics-Based Confetti Animation */}
      {dimensions.width > 0 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(80)].map((_, i) => {
            // Physics Constants
            const angle = Math.random() * Math.PI * 2;
            const velocity = 10 + Math.random() * 30;
            const drag = 0.93;
            const gravity = 0.12;
            
            // Calculate trajectory points
            const xPoints = [0];
            const yPoints = [0];
            let curX = 0;
            let curY = 0;
            let velX = Math.cos(angle) * velocity;
            let velY = Math.sin(angle) * velocity;

            for (let j = 0; j < 50; j++) {
              velX *= drag;
              velY *= drag;
              velY += gravity;
              curX += velX;
              curY += velY;
              xPoints.push(curX);
              yPoints.push(curY);
            }

            return (
              <motion.div
                key={i}
                initial={{ 
                  x: "50vw", 
                  y: "45vh", 
                  scale: 0, 
                  rotate: 0,
                  opacity: 1 
                }}
                animate={{
                  x: xPoints.map(p => `calc(50vw + ${p}px)`),
                  y: yPoints.map(p => `calc(45vh + ${p}px)`),
                  scale: [0, 1, 1, 0.7, 0],
                  rotate: [0, 180, 360, 540, 720],
                  opacity: [0, 1, 1, 0.8, 0],
                }}
                transition={{
                  duration: 2.5 + Math.random() * 2,
                  ease: "easeOut",
                  delay: Math.random() * 0.3,
                }}
                className="absolute left-0 top-0"
                style={{
                  width: Math.random() > 0.5 ? "10px" : "6px",
                  height: Math.random() > 0.5 ? "4px" : "8px",
                  backgroundColor: [
                    "#3b82f6", "#22c55e", "#eab308", "#ef4444", "#a855f7", "#ec4899", "#2dd4bf"
                  ][Math.floor(Math.random() * 7)],
                  borderRadius: Math.random() > 0.7 ? "50%" : "2px",
                  zIndex: 0,
                }}
              />
            );
          })}
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 w-full max-w-md mx-auto">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            delay: 0.2, 
            type: "spring", 
            stiffness: 200,
            damping: 20
          }}
          className="relative inline-flex items-center justify-center mb-5"
        >
          <div className="w-18 h-18 sm:w-16 sm:h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" strokeWidth={2.5} />
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
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2"
        >
          Order Placed Successfully! 🎉
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-medium mb-6"
        >
          Thank you for shopping with Freshcart
        </motion.p>

        {/* Message - No Container */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-6"
        >
          Your order has been placed and is being processed. You can track its progress in your{" "}
          <span className="font-semibold text-blue-600 dark:text-blue-400">My Orders</span> section.
        </motion.p>

        {/* Package Icon */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
          className="flex justify-center mb-6"
        >
          <motion.div
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center"
          >
            <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </motion.div>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Link href="/user/my-order">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-2 px-8 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-full transition-all shadow-md text-sm"
            >
              <ShoppingBag size={16} />
              <span>Go to My Orders</span>
              <motion.span
                animate={{ x: [0, 3, 0] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatDelay: 1.5,
                }}
              >
                <ArrowRight size={14} />
              </motion.span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Footer Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-xs text-slate-500 dark:text-slate-400 mt-5"
        >
          Order confirmation sent to your email
        </motion.p>
      </div>

      {/* Background Glow Effect */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}

export default OrderSuccess;