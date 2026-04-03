// app/checkout/page.tsx
"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import { ArrowLeft, CreditCard, Home, ShoppingBag, Leaf } from "lucide-react";
import CheckoutForm from "@/components/CheckoutForm";
import CheckoutSummary from "@/components/CheckoutSummary";

export default function CheckoutPage() {
  const router = useRouter();
  const { userData } = useSelector((state: RootState) => state.user);
  const { cartData, subTotal, deliveryCharge, finalTotal } = useSelector(
    (state: RootState) => state.cart,
  );

  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("cod");
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [address, setAddress] = useState<any>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // If cart is empty, show empty state
  if (cartData.length === 0) {
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
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center"
          >
            <ShoppingBag className="w-12 h-12 text-blue-600" />
          </motion.div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Your cart is empty
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Add some fresh groceries to your cart before checking out!
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all font-medium"
          >
            <Home size={18} />
            <span>Continue Shopping</span>
          </Link>
        </motion.div>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!address) {
      alert("Please fill in your delivery address");
      return;
    }

    setIsPlacingOrder(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Order placed:", {
      paymentMethod,
      total: finalTotal,
      address,
    });

    alert(
      `Order placed successfully!\n\nPayment Method: ${paymentMethod === "online" ? "Pay Online" : "Cash on Delivery"}\nTotal: ₹${finalTotal.toFixed(2)}\n\nThank you for shopping with Freshcart!`,
    );

    setIsPlacingOrder(false);
  };

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
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] py-6 sm:py-8 md:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 cursor-pointer mb-6 group"
          onClick={() => router.push("/user/cart")}
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="text-sm font-medium">Back to Cart</span>
        </motion.div>

        {/* Header Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-8 sm:mb-10"
        >
          <motion.div
            variants={itemVariants}
            className="flex justify-center mb-3"
          >
            <div className="relative">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <CreditCard className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
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
          </motion.div>
          <motion.h1
            variants={itemVariants}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2"
          >
            Checkout
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-sm text-blue-600 dark:text-blue-400 font-medium"
          >
            Complete your order
          </motion.p>
        </motion.div>

        {/* Main Content - Only 2 components */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Form (Address + Payment) */}
          <div className="lg:col-span-2">
            <CheckoutForm
              userData={userData}
              onAddressChange={setAddress}
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
              onPositionChange={setPosition}
              onError={setFormError} 
            />
          </div>

          {/* Right Column - Summary */}
          <div>
            <CheckoutSummary
              subTotal={subTotal}
              deliveryCharge={deliveryCharge}
              finalTotal={finalTotal}
              cartItemsCount={cartData.length}
              isPlacingOrder={isPlacingOrder}
              onPlaceOrder={handlePlaceOrder}
              paymentMethod={paymentMethod}
              address={address}
              position={position}
              userData={userData}
              cartData={cartData}
              formError={formError}
            />
          </div>
        </div>
      </div>
    </div>
  );
}