"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldOff, Home, AlertCircle, Leaf } from "lucide-react";

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center max-w-md mx-auto"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="relative w-24 h-24 mx-auto mb-6"
        >
          <div className="w-full h-full rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <ShieldOff className="w-12 h-12 text-red-600" />
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
            <AlertCircle size={16} className="text-red-500" />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2"
        >
          Access Denied
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-6"
        >
          You don't have permission to view this page. Please contact your administrator if you believe this is a mistake.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            <Home size={18} />
            <span>Go to Homepage</span>
          </Link>
        </motion.div>

        {/* Decorative Leaf Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex items-center justify-center gap-1 text-xs text-slate-400 dark:text-slate-500"
        >
          <Leaf size={12} className="text-green-600" />
          <span>Need help? Contact support</span>
        </motion.div>
      </motion.div>
    </div>
  );
}