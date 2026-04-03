"use client";

import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import { ArrowLeft, Phone, ChevronRight, User, Truck } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";

interface RoleOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

export default function EditRoleMobile() {
  const router = useRouter();
  const { update } = useSession();
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [error, setError] = useState<string>("");

  const roles: RoleOption[] = [
    {
      id: "admin",
      label: "Admin",
      icon: <User size={22} className="text-blue-600" />,
      description: "Full access",
    },
    {
      id: "user",
      label: "User",
      icon: <User size={22} className="text-green-600" />,
      description: "Order groceries",
    },
    {
      id: "delivery",
      label: "DeliveryBoy",
      icon: <Truck size={22} className="text-amber-600" />,
      description: "Deliver orders",
    },
  ];

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

  const backButtonVariants: Variants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const validateMobile = (number: string): boolean => {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(number);
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setMobileNumber(value);
    if (value && !validateMobile(value)) {
      setError("Please enter a valid 10-digit mobile number");
    } else {
      setError("");
    }
  };

  const handleEdit = async () => {
    try {
      const result = await axios.post("/api/user/edit-role-mobile", {
        role: selectedRole,
        mobile: mobileNumber,
      });
      await update({role: selectedRole});
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center p-4 overflow-hidden"
    >
      {/* Back Button */}
      <motion.button
        variants={backButtonVariants}
        initial="hidden"
        animate="visible"
        onClick={() => router.back()}
        whileHover={{ x: -3 }}
        whileTap={{ scale: 0.95 }}
        className="absolute top-4 left-4 p-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg z-10"
      >
        <ArrowLeft size={20} />
      </motion.button>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.4,
          ease: "easeOut",
          delay: 0.1,
        }}
        className="w-full max-w-[360px]"
      >
        <motion.div
          whileHover={{
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          }}
          className="bg-white dark:bg-[#0f1729] rounded-2xl shadow-xl p-6"
        >
          {/* Header */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center mb-6"
          >
            <motion.h1
              variants={itemVariants}
              className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1.5"
            >
              Select Your Role
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-sm text-slate-600 dark:text-slate-400"
            >
              Choose how to use{" "}
              <span className="text-blue-600 dark:text-blue-400 font-bold">
                Freshcart
              </span>
            </motion.p>
          </motion.div>

          {/* Role Selection - Perfectly aligned icons */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex justify-center gap-8 mb-6"
          >
            {roles.map((role) => (
              <motion.button
                key={role.id}
                variants={itemVariants}
                whileHover={{
                  scale: 1.1,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedRole(role.id)}
                className="flex flex-col items-center text-center relative group"
              >
                <div
                  className={`w-16 h-16 flex items-center justify-center rounded-full mb-2 transition-all duration-200 ${
                    selectedRole === role.id
                      ? "bg-blue-100 dark:bg-blue-500/20 ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-[#0f1729]"
                      : "bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-center">
                    {role.icon}
                  </div>
                </div>
                <h3
                  className={`font-semibold text-sm transition-colors duration-200 ${
                    selectedRole === role.id
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                  }`}
                >
                  {role.label}
                </h3>
                {selectedRole === role.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
                  >
                    <svg
                      className="w-2.5 h-2.5 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </motion.div>

          {/* Mobile Number Input */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-6"
          >
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Enter Mobile Number
              </label>
              <div className="relative">
                <Phone
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={handleMobileChange}
                  placeholder="0000000000"
                  className={`w-full pl-10 pr-3 py-3 text-sm rounded-lg border ${
                    error
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-slate-300 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500"
                  } bg-white dark:bg-[#1e293b] text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 transition`}
                />
              </div>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-red-500 text-xs mt-1.5"
                >
                  {error}
                </motion.p>
              )}
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                We'll send a verification code
              </p>
            </motion.div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleEdit}
              disabled={!selectedRole || !mobileNumber || !!error}
              className={`w-full py-3 text-base rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                !selectedRole || !mobileNumber || !!error
                  ? "bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
              }`}
            >
              Continue
              <ChevronRight size={18} />
            </motion.button>
          </motion.div>

          {/* Footer Note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-xs text-center text-slate-500 dark:text-slate-400 mt-5"
          >
            By continuing, you agree to Terms & Privacy Policy
          </motion.p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
