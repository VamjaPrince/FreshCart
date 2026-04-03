"use client";

import { motion } from "framer-motion";
import {
  Package,
  Truck,
  Clock,
  Shield,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { clearCart } from "@/redux/cartSlice";
import { useState } from "react";

interface CheckoutSummaryProps {
  subTotal: number;
  deliveryCharge: number;
  finalTotal: number;
  cartItemsCount: number;
  isPlacingOrder: boolean;
  onPlaceOrder: () => void;
  paymentMethod: "online" | "cod";
  address: any;
  position: [number, number] | null;
  userData: any;
  cartData: any[];
  formError?: string | null; 
}

export default function CheckoutSummary({
  subTotal,
  deliveryCharge,
  finalTotal,
  cartItemsCount,
  isPlacingOrder,
  onPlaceOrder,
  paymentMethod,
  address,
  position,
  userData,
  cartData,
  formError, 
}: CheckoutSummaryProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 3000);
  };


  const validateOrder = () => {
    if (!position || (position[0] === 20.5937 && position[1] === 78.9629)) {
      showError(
        "Please select your delivery location by dragging the marker on map",
      );
      return false;
    }

    if (!address?.fullName || !address?.mobile || !address?.fullAddress) {
      showError("Please fill all address details");
      return false;
    }

    if (!address?.city || !address?.state || !address?.pincode) {
      showError("Please fill complete address details (City, State, Pincode)");
      return false;
    }

    if (!userData?._id) {
      showError("Please login to place order");
      return false;
    }

    if (cartData.length === 0) {
      showError("Your cart is empty");
      return false;
    }

    return true;
  };

  const handleCod = async () => {
    if (!validateOrder()) return;

    setLoading(true);
    try {
      const result = await axios.post("/api/user/order", {
        userId: userData?._id,
        items: cartData.map((item) => ({
          grocery: item._id,
          name: item.name,
          price: item.price,
          unit: item.unit,
          quantity: item.quantity,
          image: item.image,
        })),
        totalAmount: finalTotal,
        address: {
          fullName: address.fullName,
          mobile: address.mobile,
          city: address.city,
          state: address.state,
          fullAddress: address.fullAddress,
          pinCode: address.pincode,
          latitude: position ? position[0] : undefined,
          longitude: position ? position[1] : undefined,
        },
        paymentMethod: "COD",
      });

      if (result.data) {
        dispatch(clearCart());
        router.push("/user/order-success");
      }
    } catch (error) {
      console.log("Place order failed", error);
      showError("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

const handleOnlinePayment = async () => {
  if (!validateOrder()) return;

  setLoading(true);
  try {
    // Create Razorpay order ONLY (no temporary order)
    const { data } = await axios.post("/api/user/razorpay-payment", {
      userId: userData?._id,
      totalAmount: finalTotal,
    });

    // Load Razorpay script if not loaded
    if (!(window as any).Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
      await new Promise((resolve) => {
        script.onload = resolve;
      });
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: data.order.amount,
      currency: "INR",
      name: "Freshcart",
      description: "Order Payment",
      order_id: data.order.id,
      prefill: {
        name: address.fullName,
        email: userData?.email || "",
        contact: address.mobile,
      },
      theme: {
        color: "#3b82f6",
      },
      modal: {
        ondismiss: function() {
          setLoading(false);
          showError("Payment cancelled");
        },
      },
      handler: async function(response: any) {
        try {
          // Create final order ONLY after successful payment
          const orderResponse = await axios.post("/api/user/order", {
            userId: userData?._id,
            items: cartData.map((item) => ({
              grocery: item._id,
              name: item.name,
              price: item.price,
              unit: item.unit,
              quantity: item.quantity,
              image: item.image,
            })),
            totalAmount: finalTotal,
            address: {
              fullName: address.fullName,
              mobile: address.mobile,
              city: address.city,
              state: address.state,
              pinCode: address.pincode,
              fullAddress: address.fullAddress,
              latitude: position ? position[0] : undefined,
              longitude: position ? position[1] : undefined,
            },
            paymentMethod: "Online",
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          });

          if (orderResponse.data) {
            dispatch(clearCart());
            router.push("/user/order-success");
          }
        } catch (err) {
          console.log("Order save failed", err);
          showError("Payment successful but order saving failed. Please contact support.");
          setLoading(false);
        }
      },
    };

    const rzp = new (window as any).Razorpay(options);
    
    rzp.on("payment.failed", function(response: any) {
      console.log("Payment failed:", response.error);
      showError(response.error.description || "Payment failed. Please try again.");
      setLoading(false);
    });

    rzp.open();
    
  } catch (err: any) {
    console.log("Payment initiation failed:", err);
    showError(err.response?.data?.message || "Failed to initiate payment. Please try again.");
    setLoading(false);
  }
};

  const handlePlaceOrder = async () => {
    if (paymentMethod === "cod") {
      await handleCod();
    } else {
      await handleOnlinePayment();
    }
  };

  // Check if location is selected
  const isLocationSelected =
    position && !(position[0] === 20.5937 && position[1] === 78.9629);

  return (
    <div className="space-y-5">
      {/* Order Summary Card */}
      <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-lg p-5">
        {/* Header */}
        <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-200 dark:border-slate-700">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Package size={18} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Order Summary
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {cartItemsCount} items in cart
            </p>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="space-y-3 mb-5">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Subtotal</span>
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

          {deliveryCharge === 0 && subTotal > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="mt-2 p-2 bg-green-50 dark:bg-green-500/10 rounded-lg text-center"
            >
              <p className="text-xs text-green-600 flex items-center justify-center gap-1">
                <Truck size={12} />
                You've unlocked free delivery!
              </p>
            </motion.div>
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

     {/* Error Message Box - Shows all validation errors */}
{(errorMessage || formError) && (
  <motion.div
    initial={{ opacity: 0, y: -5 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -5 }}
    className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
  >
    <div className="flex items-center gap-2">
      <AlertCircle
        size={14}
        className="text-yellow-600 dark:text-yellow-500 flex-shrink-0"
      />
      <p className="text-xs text-yellow-700 dark:text-yellow-400 flex-1">
        {errorMessage || formError}
      </p>
    </div>
  </motion.div>
)}

{/* Location Warning - Shows only when location not selected and no error */}
{!isLocationSelected && !errorMessage && !formError && (
  <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
    <div className="flex items-center gap-2">
      <AlertCircle
        size={14}
        className="text-yellow-600 dark:text-yellow-500 flex-shrink-0"
      />
      <p className="text-xs text-yellow-700 dark:text-yellow-400">
        Please drag the marker to your delivery location on the map
      </p>
    </div>
  </div>
)}

        {/* Secure Payment Badge */}
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <Shield size={12} />
            <span>Secure Payment</span>
            <span className="mx-1">•</span>
            <span>256-bit SSL Encrypted</span>
          </div>
        </div>
      </div>

      {/* Place Order Button with Loader */}
      <button
        onClick={handlePlaceOrder}
        disabled={loading || isPlacingOrder}
        className={`w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg ${
          loading || isPlacingOrder ? "opacity-90 cursor-not-allowed" : ""
        }`}
      >
        {loading || isPlacingOrder ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Placing Order...</span>
          </>
        ) : (
          <>
            <CheckCircle2 size={18} />
            <span>Place Order</span>
          </>
        )}
      </button>

      <p className="text-center text-xs text-slate-500 dark:text-slate-400">
        By placing this order, you agree to our Terms of Service and Privacy
        Policy
      </p>
    </div>
  );
}
