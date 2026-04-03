"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import {
  removeFromCart,
  decreaseQuantity,
  increaseQuantity,
  clearCart,
} from "@/redux/cartSlice";
import Image from "next/image";
import Link from "next/link";
import {
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  Truck,
  CreditCard,
  ShoppingCart,
  Leaf,
  Package,
  Shield,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

function CartPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { cartData, subTotal, deliveryCharge, finalTotal } = useSelector(
    (state: RootState) => state.cart,
  );

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
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center relative"
          >
            <ShoppingCart className="w-12 h-12 text-blue-600" />
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
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Your cart is empty
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Looks like you haven't added any items to your cart yet. Start
            exploring our fresh groceries!
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all font-medium shadow-md"
          >
            <ShoppingCart size={18} />
            <span>Continue Shopping</span>
          </Link>
        </motion.div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 },
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
          onClick={() => router.push("/")}
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="text-sm font-medium">Back to Home</span>
        </motion.div>

        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="flex justify-center mb-3">
            <div className="relative">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <ShoppingCart className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
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
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Your Shopping Cart
          </h1>
          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
            {cartData.length} {cartData.length === 1 ? "item" : "items"} in your
            cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartData.map((item, index) => (
              <motion.div
                key={`${item._id.toString()}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="bg-white dark:bg-[#1e293b] rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-4 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-xl flex items-center justify-center flex-shrink-0">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={60}
                        height={60}
                        className="object-contain w-14 h-14"
                      />
                    ) : (
                      <Package className="w-8 h-8 text-slate-400" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
                          {item.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {item.category} • {item.unit}
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => dispatch(removeFromCart(item._id))}
                        className="text-red-500 hover:text-red-600 transition-colors p-1 flex-shrink-0"
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
                      <div>
                        <span className="text-xs text-slate-400 line-through block">
                          ₹{(item.price * 1.2).toFixed(2)}
                        </span>
                        <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                          ₹{item.price}
                        </span>
                      </div>

                      {/* Quantity Counter */}
                      <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-full bg-white dark:bg-[#1e293b] px-1 py-1 shadow-sm">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => dispatch(decreaseQuantity(item._id))}
                          className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-all"
                        >
                          <Minus size={14} />
                        </motion.button>
                        <motion.span
                          key={item.quantity}
                          initial={{ scale: 1.2 }}
                          animate={{ scale: 1 }}
                          className="min-w-[30px] text-center font-semibold text-slate-900 dark:text-white text-sm"
                        >
                          {item.quantity}
                        </motion.span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => dispatch(increaseQuantity(item._id))}
                          className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-all"
                        >
                          <Plus size={14} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-lg p-5 sticky top-6">
              {/* Header */}
              <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-200 dark:border-slate-700">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <CreditCard size={18} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Order Summary
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {cartData.length} items in cart
                  </p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">
                    Subtotal
                  </span>
                  <span className="text-slate-900 dark:text-white font-semibold">
                    ₹{subTotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Truck size={14} />
                    <span>Delivery charge</span>
                  </div>
                  {deliveryCharge === 0 ? (
                    <span className="text-green-600 font-semibold flex items-center gap-1">
                      <span>Free</span>
                    </span>
                  ) : (
                    <span className="text-slate-900 dark:text-white">
                      ₹{deliveryCharge.toFixed(2)}
                    </span>
                  )}
                </div>

                {deliveryCharge > 0 && subTotal < 100 && (
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-xs text-blue-600 dark:text-blue-400 text-center">
                      Add ₹{(100 - subTotal).toFixed(2)} more for free delivery
                    </p>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center py-4 border-t border-slate-200 dark:border-slate-700">
                <span className="text-base font-bold text-slate-900 dark:text-white">
                  Total Amount
                </span>
                <span className="text-2xl font-bold text-blue-600">
                  ₹{finalTotal.toFixed(2)}
                </span>
              </div>

              {/* Delivery Info */}
              <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <Clock size={12} />
                  <span>Estimated delivery: Tomorrow, 10am - 2pm</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <Shield size={12} />
                  <span>Free cancellation within 1 hour</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-3 mt-5">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md"
                  onClick={() => router.push("/user/checkout")}
                >
                  <CreditCard size={18} />
                  <span>Proceed to Checkout</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => dispatch(clearCart())}
                  className="w-full py-3 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 font-semibold rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} />
                  <span>Clear Cart</span>
                </motion.button>
              </div>

              {/* Free Delivery Badge */}
              {deliveryCharge === 0 && subTotal > 0 && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-500/10 rounded-xl text-center">
                  <p className="text-xs text-green-600 dark:text-green-400 flex items-center justify-center gap-1">
                    <Truck size={12} />
                    You've unlocked free delivery!
                  </p>
                </div>
              )}

              {/* Secure Payment Badge */}
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <Shield size={12} />
                  <span>Secure Checkout</span>
                  <span className="mx-1">•</span>
                  <span>256-bit SSL Encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
