// app/login/page.tsx
"use client";

import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Leaf } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginForm() {
  const router = useRouter();
  const [loginData, setLoginData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Validation
  const validateEmail = (email: string): string => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email";
    return "";
  };

  const validatePassword = (password: string): string => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    return "";
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      email: validateEmail(loginData.email),
      password: validatePassword(loginData.password),
    };

    Object.keys(newErrors).forEach((key) => {
      if (newErrors[key as keyof FormErrors] === "") {
        delete newErrors[key as keyof FormErrors];
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      let error = "";
      switch (name) {
        case "email":
          error = validateEmail(value);
          break;
        case "password":
          error = validatePassword(value);
          break;
      }
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    let error = "";
    switch (name) {
      case "email":
        error = validateEmail(value);
        break;
      case "password":
        error = validatePassword(value);
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const session = useSession();
  console.log(session);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      email: true,
      password: true,
    });

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await signIn("credentials", {
        email: loginData.email,
        password: loginData.password,
      });
      router.push("/");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center p-2 sm:p-4 overflow-hidden"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.4,
          ease: "easeOut",
          delay: 0.1,
        }}
        className="w-full max-w-[280px] xs:max-w-sm sm:max-w-sm"
      >
        {/* Form Container */}
        <motion.div
          whileHover={{
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          }}
          className="bg-white dark:bg-[#0f1729] rounded-xl shadow-lg p-4 sm:p-6"
        >
          {/* Header */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center mb-3 sm:mb-4"
          >
            <motion.h1
              variants={itemVariants}
              className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-0.5"
            >
              Welcome Back
            </motion.h1>
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center gap-1.5"
            >
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Sign in to Freshcart
              </p>
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
              >
                <Leaf size={14} className="text-green-600" strokeWidth={2.5} />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Form */}
          <motion.form
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            onSubmit={handleLogin}
            className="space-y-2.5 sm:space-y-3"
          >
            {/* Email Field */}
            <motion.div variants={itemVariants}>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={14}
                />
                <input
                  type="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Your Email"
                  className={`w-full pl-8 sm:pl-9 pr-3 py-2 sm:py-2.5 text-xs sm:text-sm rounded-lg border ${
                    touched.email && errors.email
                      ? "border-red-500"
                      : "border-slate-300 dark:border-slate-700 focus:border-blue-500"
                  } bg-white dark:bg-[#1e293b] text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition`}
                />
              </div>
              {touched.email && errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-red-500 text-[10px] sm:text-xs mt-1"
                >
                  {errors.email}
                </motion.p>
              )}
            </motion.div>

            {/* Password Field */}
            <motion.div variants={itemVariants}>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={14}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={loginData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Your Password"
                  className={`w-full pl-8 sm:pl-9 pr-8 sm:pr-10 py-2 sm:py-2.5 text-xs sm:text-sm rounded-lg border ${
                    touched.password && errors.password
                      ? "border-red-500"
                      : "border-slate-300 dark:border-slate-700 focus:border-blue-500"
                  } bg-white dark:bg-[#1e293b] text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition`}
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </motion.button>
              </div>

              {touched.password && errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-red-500 text-[10px] sm:text-xs mt-1"
                >
                  {errors.password}
                </motion.p>
              )}
            </motion.div>

            {/* Login Button with loader */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm rounded-lg font-medium transition-all duration-200 mt-1 sm:mt-2 flex items-center justify-center ${
                isLoading ? "opacity-90 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              ) : (
                "Sign In"
              )}
            </motion.button>

            {/* OR Divider */}
            <motion.div
              variants={itemVariants}
              className="relative my-2 sm:my-3"
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300 dark:border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-[10px] sm:text-xs">
                <span className="px-2 bg-white dark:bg-[#0f1729] text-slate-500">
                  OR
                </span>
              </div>
            </motion.div>

            {/* Google Sign In */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              className="w-full py-2 sm:py-2.5 bg-white dark:bg-[#1e293b] border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-[#2d3748] text-slate-700 dark:text-slate-300 text-xs sm:text-sm rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              onClick={() => signIn("google", { callbackUrl: "/" })}
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </motion.button>

            {/* Register Link */}
            <motion.p
              variants={itemVariants}
              className="text-center text-slate-600 dark:text-slate-400 text-[10px] sm:text-xs mt-2 sm:mt-3"
            >
              Don't have an account?{" "}
              <button
                onClick={() => router.push("/register")}
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Sign Up
              </button>
            </motion.p>
          </motion.form>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
