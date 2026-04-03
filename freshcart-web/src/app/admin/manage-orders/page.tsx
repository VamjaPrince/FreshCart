"use client";

import { IOrder } from "@/models/order.model";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Package, ClipboardList, Leaf } from "lucide-react";
import { useRouter } from "next/navigation";
import AdminOrderCard from "@/components/AdminOrderCard";

function ManageOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const result = await fetch("/api/admin/get-orders");
        const data = await result.json();
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.log("get orders error: ", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    getOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center"
          >
            <ClipboardList className="w-12 h-12 text-blue-600" />
          </motion.div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            No orders yet
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            There are no orders placed by customers yet.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] py-6 sm:py-8 md:py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="flex justify-start mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => router.push("/admin")}
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 cursor-pointer group lg:ml-[-200px]"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </motion.div>
        </div>

        {/* Header with Animation */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="flex justify-center mb-3">
            <div className="relative">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center ">
                <ClipboardList className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
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
            Manage Orders
          </h1>
          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
            View and update customer orders
          </p>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order) => (
            <AdminOrderCard key={order._id.toString()} order={order} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ManageOrders;