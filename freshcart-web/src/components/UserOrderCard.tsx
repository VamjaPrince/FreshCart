// app/components/UserOrderCard.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Truck,
  ChevronDown,
  ChevronUp,
  Clock,
  MapPin,
  CreditCard,
  IndianRupee,
} from "lucide-react";
import { IOrder } from "@/models/order.model";

function UserOrderCard({ order }: { order: IOrder }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "text-yellow-600 bg-yellow-50 dark:bg-yellow-500/10";
      case "Out for Delivery":
        return "text-blue-600 bg-blue-50 dark:bg-blue-500/10";
      case "Delivered":
        return "text-green-600 bg-green-50 dark:bg-green-500/10";
      default:
        return "text-slate-600 bg-slate-50 dark:bg-slate-500/10";
    }
  };

  const getPaymentStatusColor = (isPaid: boolean) => {
    return isPaid
      ? "text-green-600 bg-green-50 dark:bg-green-500/10"
      : "text-red-600 bg-red-50 dark:bg-red-500/10";
  };

  const getPaymentMethodLabel = (method: string) => {
    if (method === "COD") return "Cash on Delivery";
    if (method === "Online") return "Online Payment";
    return method;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-[#1e293b] rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      {/* Order Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg shrink-0">
              <Package size={18} className="text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Order #{order._id.toString().slice(-8)}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                <Clock size={10} className="shrink-0" />
                <span>{formatDate(order.createdAt)}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(order.isPaid === true)}`}
            >
              {order.isPaid === true ? "Paid" : "Unpaid"}
            </span>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}
            >
              {order.status}
            </span>
          </div>
        </div>
      </div>

      {/* Order Details - Single Column */}
      <div className="p-4 sm:p-5 space-y-3">
        {/* Payment Method - Single Line */}
        <div className="flex items-center gap-2 text-sm">
          <CreditCard size={14} className="text-slate-400 shrink-0" />
          <span className="text-slate-700 dark:text-slate-300">
            {getPaymentMethodLabel(order.paymentMethod)}
          </span>
        </div>

        {/* Delivery Address - Single Line */}
        <div className="flex items-start gap-2 text-sm">
          <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
          <span className="text-slate-600 dark:text-slate-400 break-words">
            {order.address.fullAddress}
          </span>
        </div>

        {/* Items Summary */}
        <div className="pt-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span>
                {isExpanded ? "Hide Order Items" : "View Order Items"}
              </span>
              <span className="text-xs text-slate-500">
                ({order.items.length} items)
              </span>
            </div>
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-3 space-y-2"
              >
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center py-2 border-t border-slate-100 dark:border-slate-700"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded-lg shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {item.quantity} x {item.unit}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-blue-600 shrink-0 ml-2">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer - Delivery Status */}
        <div className="flex justify-between items-center pt-3 mt-3 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
            <Truck size={12} className="shrink-0 sm:w-3.5 sm:h-3.5" />
            <span className="font-medium text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
              Delivery:
            </span>
            <span className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
              {order.status}
            </span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5">
            <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
              Total:
            </span>
            <span className="text-base sm:text-lg md:text-xl font-bold text-blue-600">
              ₹{order.totalAmount}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default UserOrderCard;
