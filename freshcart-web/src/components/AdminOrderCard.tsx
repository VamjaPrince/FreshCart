"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  ChevronDown,
  ChevronUp,
  MapPin,
  CreditCard,
  User,
  Phone,
  CheckCircle,
  Truck,
  Clock,
  IndianRupee,
} from "lucide-react";
import { IOrder } from "@/models/order.model";

type OrderStatus = "Pending" | "Out for Delivery" | "Delivered" | "Failed";
type UserType = { name?: string } | string | undefined;

function AdminOrderCard({ order }: { order: IOrder & { user?: UserType } }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [localStatus, setLocalStatus] = useState<OrderStatus>(order.status);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const getStatusColor = (status: OrderStatus) => {
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

  const updateOrderStatus = async (newStatus: OrderStatus) => {
    setUpdatingStatus(true);
    try {
      const response = await fetch("/api/admin/update-order-status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order._id, status: newStatus }),
      });
      if (response.ok) {
        setLocalStatus(newStatus);
        setIsDropdownOpen(false);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const displayOrderId = order._id.toString().slice(-6);

  const statusOptions = [
    { value: "Pending", label: "Pending", icon: Clock },
    { value: "Out for Delivery", label: "Out for Delivery", icon: Truck },
    { value: "Delivered", label: "Delivered", icon: CheckCircle },
  ];

  const currentStatusOption = statusOptions.find(
    (opt) => opt.value === localStatus,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-[#1e293b] rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="p-4 sm:p-5">
        {/* Order Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Order #{displayOrderId}
              </h3>
              {order.isPaid === false && (
                <span className="px-2 py-0.5 text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-500/10 rounded-full">
                  Unpaid
                </span>
              )}
              {order.isPaid === true && (
                <span className="px-2 py-0.5 text-xs font-semibold text-green-600 bg-green-50 dark:bg-green-500/10 rounded-full">
                  Paid
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <Clock size={12} className="text-slate-400" />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {formatDate(order.createdAt)}
              </p>
            </div>
          </div>

          {/* Custom Status Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              disabled={updatingStatus}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${getStatusColor(localStatus)}`}
            >
              {currentStatusOption?.icon && (
                <currentStatusOption.icon size={12} />
              )}
              <span>{localStatus}</span>
              <ChevronDown
                size={12}
                className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-44 bg-white dark:bg-[#1e293b] rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden z-10"
                >
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        updateOrderStatus(option.value as OrderStatus)
                      }
                      className={`flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors ${
                        localStatus === option.value
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <option.icon size={14} />
                      <span>{option.label}</span>
                      {localStatus === option.value && (
                        <CheckCircle size={12} className="ml-auto" />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Customer Details - Single Column - Dynamic Data */}
        <div className="space-y-2 mb-4">
          {typeof order.user === "object" &&
            order.user !== null &&
            "name" in order.user &&
            order.user.name && (
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <User size={14} className="shrink-0" />
                <span className="text-sm">{order.user.name}</span>
              </div>
            )}
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <CreditCard size={14} className="shrink-0" />
            <span className="text-sm capitalize">{order.paymentMethod}</span>
          </div>
          {order.address?.mobile && (
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Phone size={14} className="shrink-0" />
              <span className="text-sm">{order.address.mobile}</span>
            </div>
          )}
          {order.address?.fullAddress && (
            <div className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
              <MapPin size={14} className="shrink-0 mt-0.5" />
              <span className="text-sm break-words">
                {order.address.fullAddress}
              </span>
            </div>
          )}
        </div>

        {/* Order Items Toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors py-2 border-t border-slate-100 dark:border-slate-700"
        >
          <div className="flex items-center gap-2">
            <Package size={14} />
            <span>{isExpanded ? "Hide Order Items" : "View Order Items"}</span>
            <span className="text-xs text-slate-500">
              ({order.items?.length || 0} items)
            </span>
          </div>
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {/* Order Items List */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-3 space-y-2"
            >
              {order.items?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center py-2 border-t border-slate-100 dark:border-slate-700"
                >
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    )}
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {item.quantity} x {item.unit}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-blue-600">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              ))}

              {/* Total Amount inside expanded items */}
              <div className="flex justify-between items-center pt-3 mt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  Total Amount
                </span>
                <div className="flex items-center gap-1">
                  <IndianRupee size={16} className="text-blue-600" />
                  <span className="text-lg font-bold text-blue-600">
                    {order.totalAmount}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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

export default AdminOrderCard;
