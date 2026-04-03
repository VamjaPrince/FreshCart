// app/components/CheckoutForm.tsx
"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Search,
  Loader2,
  AlertCircle,
  LocateFixed,
  User,
  Phone,
  Home,
  Building2,
  Map,
  CreditCard,
  Wallet,
  Banknote,
  CheckCircle2,
  Shield,
} from "lucide-react";
import axios from "axios";
import dynamic from "next/dynamic";

// Dynamically import map with no SSR
const MapWithNoSSR = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] w-full bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={32} />
    </div>
  ),
});

interface AddressData {
  fullName: string;
  mobile: string;
  city: string;
  state: string;
  pincode: string;
  fullAddress: string;
}

interface CheckoutFormProps {
  userData?: any;
  onAddressChange: (address: AddressData) => void;
  paymentMethod: "online" | "cod";
  onPaymentMethodChange: (method: "online" | "cod") => void;
  onPositionChange?: (position: [number, number] | null) => void;
  onError?: (error: string | null) => void;
}

export default function CheckoutForm({
  userData,
  onAddressChange,
  paymentMethod,
  onPaymentMethodChange,
  onPositionChange,
  onError,
}: CheckoutFormProps) {
  const [address, setAddress] = useState<AddressData>({
    fullName: "",
    mobile: "",
    city: "",
    state: "",
    pincode: "",
    fullAddress: "",
  });

  const [searchArea, setSearchArea] = useState("");
  const [searching, setSearching] = useState(false);
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const addressFetchedRef = useRef(false);

  const defaultCenter: [number, number] = [20.5937, 78.9629];

  // Load user data
  useEffect(() => {
    if (userData) {
      setAddress((prev) => ({
        ...prev,
        fullName: userData.name || "",
        mobile: userData.mobile || "",
      }));
    }
  }, [userData]);

  useEffect(() => {
    if (onPositionChange && position) {
      onPositionChange(position);
    }
  }, [position, onPositionChange]);

  // Notify parent of address changes
  useEffect(() => {
    onAddressChange(address);
  }, [address, onAddressChange]);

  const getCityFromAddress = useCallback((addressData: any): string => {
    return (
      addressData.address?.city ||
      addressData.address?.town ||
      addressData.address?.village ||
      addressData.address?.municipality ||
      addressData.address?.county ||
      ""
    );
  }, []);

  const getStateFromAddress = useCallback((addressData: any): string => {
    return addressData.address?.state || "";
  }, []);

  const getPincodeFromAddress = useCallback((addressData: any): string => {
    return addressData.address?.postcode || "";
  }, []);

  const getFullAddressFromResult = useCallback((addressData: any): string => {
    return addressData.display_name || "";
  }, []);

  const fetchAddressFromCoords = useCallback(
    async (lat: number, lng: number) => {
      setIsLoadingAddress(true);
      if (onError) onError(null);

      try {
        const result = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        );

        if (result.data) {
          const city = getCityFromAddress(result.data);
          const state = getStateFromAddress(result.data);
          const pincode = getPincodeFromAddress(result.data);
          const fullAddress = getFullAddressFromResult(result.data);

          setAddress((prev) => ({
            ...prev,
            city: city || prev.city,
            state: state || prev.state,
            pincode: pincode || prev.pincode,
            fullAddress: fullAddress || prev.fullAddress,
          }));
        } else {
          if (onError)
            onError("Could not fetch address details. Please enter manually.");
        }
      } catch (error) {
        console.error("Error fetching address:", error);
        if (onError)
          onError("Failed to fetch address. Please check your connection.");
      } finally {
        setIsLoadingAddress(false);
      }
    },
    [
      getCityFromAddress,
      getStateFromAddress,
      getPincodeFromAddress,
      getFullAddressFromResult,
    ],
  );

  // Get current location
  useEffect(() => {
    if (navigator.geolocation && !addressFetchedRef.current) {
      setIsLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          const newPosition: [number, number] = [latitude, longitude];
          setPosition(newPosition);
          addressFetchedRef.current = true;
          await fetchAddressFromCoords(latitude, longitude);
          setIsLoadingLocation(false);
        },
        (err) => {
          console.log("Geolocation error:", err);
          if (onError) {
            onError(
              "Unable to get your location. Please allow location access.",
            );
          }
          setIsLoadingLocation(false);
        },
        { enableHighAccuracy: false, timeout: 10000 },
      );
    }
  }, [fetchAddressFromCoords]);

  const handlePositionChange = useCallback(
    (newPosition: [number, number]) => {
      setPosition(newPosition);
      fetchAddressFromCoords(newPosition[0], newPosition[1]);
    },
    [fetchAddressFromCoords],
  );

  const handleSearch = useCallback(async () => {
    if (!searchArea.trim()) {
      if (onError) onError("Please enter a city, area, or location to search");
      return;
    }

    setSearching(true);
    if (onError) onError(null);

    try {
      const { OpenStreetMapProvider } = await import("leaflet-geosearch");
      const provider = new OpenStreetMapProvider();
      const results = await provider.search({ query: searchArea });

      if (results.length > 0) {
        const { y: lat, x: lng, label } = results[0];
        const newPosition: [number, number] = [lat, lng];
        setPosition(newPosition);
        await fetchAddressFromCoords(lat, lng);
      } else {
        if (onError)
          onError(
            `No location found for "${searchArea}". Please try a different search term.`,
          );
      }
      setSearchArea("");
    } catch (error) {
      console.error("Search error:", error);
      if (onError)
        onError("Search failed. Please check your internet connection.");
    } finally {
      setSearching(false);
    }
  }, [searchArea, fetchAddressFromCoords]);

  const handleCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      if (onError) onError("Geolocation is not supported by your browser");
      return;
    }

    setIsLoadingLocation(true);
    if (onError) onError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const newPosition: [number, number] = [latitude, longitude];
        setPosition(newPosition);
        await fetchAddressFromCoords(latitude, longitude);
        setIsLoadingLocation(false);
      },
      (err) => {
        let errorMessage = "Unable to get your location. ";
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage +=
              "Please allow location access in your browser settings.";
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage += "Location information is unavailable.";
            break;
          case err.TIMEOUT:
            errorMessage += "Location request timed out.";
            break;
          default:
            errorMessage += "Please check your location settings.";
        }
        if (onError) onError(errorMessage);
        setIsLoadingLocation(false);
      },
      { enableHighAccuracy: false, timeout: 10000 },
    );
  }, [fetchAddressFromCoords]);

  const handleInputChange = (field: keyof AddressData, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="space-y-6">
      {/* Delivery Address Section */}
      <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <MapPin size={18} className="text-blue-600" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Delivery Address
            </h2>
          </div>

          <div className="space-y-5">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={address.fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1e293b] text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  />
                </div>
                <div className="relative">
                  <Phone
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    type="tel"
                    placeholder="Mobile Number"
                    value={address.mobile}
                    onChange={(e) =>
                      handleInputChange("mobile", e.target.value)
                    }
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1e293b] text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* Address Details */}
            <div className="space-y-4">
              <h3 className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Address Details
              </h3>
              <div className="relative">
                <Home
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="House no., Street, Area"
                  value={address.fullAddress}
                  onChange={(e) =>
                    handleInputChange("fullAddress", e.target.value)
                  }
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1e293b] text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="relative">
                  <Building2
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="City/Town"
                    value={address.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1e293b] text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  />
                </div>
                <div className="relative">
                  <Map
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={address.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1e293b] text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  />
                </div>
                <div className="relative">
                  <MapPin
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={address.pincode}
                    onChange={(e) =>
                      handleInputChange("pincode", e.target.value)
                    }
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1e293b] text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* Location Search */}
            <div className="space-y-3">
              <h3 className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Pick Location on Map
              </h3>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Search city, area or location..."
                    value={searchArea}
                    onChange={(e) => setSearchArea(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1e293b] text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={searching}
                  className="px-4 sm:px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all flex items-center justify-center min-w-[70px] sm:min-w-[90px] disabled:opacity-70"
                >
                  {searching ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    "Search"
                  )}
                </button>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <MapWithNoSSR
                  center={defaultCenter}
                  position={position}
                  onPositionChange={handlePositionChange}
                />
                <button
                  onClick={handleCurrentLocation}
                  disabled={isLoadingLocation}
                  className="absolute bottom-3 right-3 z-[1000] bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full p-2 shadow-lg transition-all border border-slate-200 dark:border-slate-700"
                >
                  {isLoadingLocation ? (
                    <Loader2 size={16} className="animate-spin text-blue-600" />
                  ) : (
                    <LocateFixed size={16} className="text-blue-600" />
                  )}
                </button>
              </div>

              {isLoadingAddress && (
                <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-blue-600 dark:text-blue-600 py-2">
                  <Loader2 size={12} className="animate-spin" />
                  <span>Fetching address details...</span>
                </div>
              )}

              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <MapPin size={10} />
                Drag the marker to adjust your exact location
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method Section - Fixed for mobile */}
      <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-lg p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <CreditCard size={18} className="text-blue-600" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Payment Method
          </h2>
        </div>

        <div className="space-y-3">
          {/* Online Payment Option - Responsive */}
          <label
            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all ${
              paymentMethod === "online"
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-slate-200 dark:border-slate-700 hover:border-blue-300"
            }`}
          >
            <div className="flex items-center gap-3 flex-1">
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "online"}
                onChange={() => onPaymentMethodChange("online")}
                className="w-4 h-4 text-blue-600 flex-shrink-0"
              />
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex-shrink-0">
                <Wallet size={18} className="text-indigo-600" />
              </div>
              <div className="flex-1">
                <span className="text-slate-700 dark:text-slate-200 font-medium text-sm sm:text-base block">
                  Pay Online
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Credit/Debit Card, UPI, NetBanking
                </span>
              </div>
            </div>
            <div className="flex gap-1 ml-8 sm:ml-0">
              <span className="text-[10px] sm:text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                Visa
              </span>
              <span className="text-[10px] sm:text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                Mastercard
              </span>
              <span className="text-[10px] sm:text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                UPI
              </span>
            </div>
          </label>

          {/* Cash on Delivery Option - Responsive */}
          <label
            className={`flex items-center gap-3 p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all ${
              paymentMethod === "cod"
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-slate-200 dark:border-slate-700 hover:border-blue-300"
            }`}
          >
            <input
              type="radio"
              name="payment"
              checked={paymentMethod === "cod"}
              onChange={() => onPaymentMethodChange("cod")}
              className="w-4 h-4 text-blue-600 flex-shrink-0"
            />
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg flex-shrink-0">
              <Banknote size={18} className="text-green-600" />
            </div>
            <div>
              <span className="text-slate-700 dark:text-slate-200 font-medium text-sm sm:text-base block">
                Cash on Delivery
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Pay when you receive your order
              </span>
            </div>
          </label>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
          <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
            <Shield size={12} />
            <CheckCircle2 size={12} className="text-green-600" />
            <span>Your payment information is secure and encrypted</span>
          </p>
        </div>
      </div>
    </div>
  );
}
