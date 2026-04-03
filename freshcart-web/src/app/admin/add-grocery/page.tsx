"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import {
  Upload,
  Package,
  Tag,
  IndianRupee,
  ChevronDown,
  X,
  Leaf,
  Apple,
  Milk,
  Coffee,
  Cookie,
  Home,
  ArrowLeft,
  Wheat,
  Flame,
  Utensils,
  Heart,
  Baby,
  Egg,
  Croissant,
  Nut,
  Snowflake,
  PawPrint,
  Check,
  Plus,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function AddGrocery() {
  const router = useRouter();
  const [groceryName, setGroceryName] = useState("");
  const [category, setCategory] = useState("");
  const [unit, setUnit] = useState("");
  const [price, setPrice] = useState("");
  const [backendImage, setBackendImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Dropdown states
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isUnitOpen, setIsUnitOpen] = useState(false);

  // Refs for dropdown positioning
  const categoryRef = useRef<HTMLDivElement>(null);
  const unitRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target as Node)
      ) {
        setIsCategoryOpen(false);
      }
      if (unitRef.current && !unitRef.current.contains(event.target as Node)) {
        setIsUnitOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categories = [
    { value: "fruits", label: "Fruits", icon: <Apple className="w-4 h-4" /> },
    {
      value: "vegetables",
      label: "Vegetables",
      icon: <Leaf className="w-4 h-4" />,
    },
    { value: "dairy", label: "Dairy", icon: <Milk className="w-4 h-4" /> },
    { value: "eggs", label: "Eggs", icon: <Egg className="w-4 h-4" /> },
    { value: "atta", label: "Atta", icon: <Wheat className="w-4 h-4" /> },
    { value: "rice", label: "Rice", icon: <Wheat className="w-4 h-4" /> },
    { value: "snacks", label: "Snacks", icon: <Package className="w-4 h-4" /> },
    {
      value: "biscuits",
      label: "Biscuits",
      icon: <Cookie className="w-4 h-4" />,
    },
    { value: "spices", label: "Spices", icon: <Flame className="w-4 h-4" /> },
    { value: "masalas", label: "Masalas", icon: <Flame className="w-4 h-4" /> },
    {
      value: "beverages",
      label: "Beverages",
      icon: <Coffee className="w-4 h-4" />,
    },
    {
      value: "personalcare",
      label: "Personal Care",
      icon: <Heart className="w-4 h-4" />,
    },
    {
      value: "household",
      label: "Household",
      icon: <Home className="w-4 h-4" />,
    },
    {
      value: "instantfood",
      label: "Instant Food",
      icon: <Utensils className="w-4 h-4" />,
    },
    {
      value: "babycare",
      label: "Baby Care",
      icon: <Baby className="w-4 h-4" />,
    },
    {
      value: "petcare",
      label: "Pet Care",
      icon: <PawPrint className="w-4 h-4" />,
    },
    {
      value: "bakery",
      label: "Bakery",
      icon: <Croissant className="w-4 h-4" />,
    },
    {
      value: "dryfruits",
      label: "Dry Fruits",
      icon: <Nut className="w-4 h-4" />,
    },
    {
      value: "frozenfood",
      label: "Frozen Food",
      icon: <Snowflake className="w-4 h-4" />,
    },
  ];

  const categoryUnits: Record<string, string[]> = {
    fruits: ["kg", "g", "pcs"],
    vegetables: ["kg", "g", "pcs"],
    dairy: ["l", "ml", "pcs"],
    eggs: ["pcs", "dozen"],
    atta: ["kg", "g"],
    rice: ["kg", "g"],
    snacks: ["pack", "pcs"],
    biscuits: ["pack"],
    spices: ["g", "pack"],
    masalas: ["g", "pack"],
    beverages: ["l", "ml", "pack"],
    personalcare: ["pcs", "ml", "pack"],
    household: ["pcs", "pack"],
    instantfood: ["pack", "pcs"],
    babycare: ["pcs", "pack"],
    petcare: ["pcs", "pack"],
    bakery: ["pcs", "pack"],
    dryfruits: ["kg", "g", "pack"],
    frozenfood: ["pack", "pcs"],
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    setBackendImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setBackendImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", groceryName);
      formData.append("category", category);
      formData.append("unit", unit);
      formData.append("price", price);
      if (backendImage) {
        formData.append("image", backendImage);
      }
      const result = await axios.post("/api/admin/add-grocery", formData);
      console.log(result.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const selectedCategory = categories.find((c) => c.value === category);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] py-6 sm:py-8 md:py-10">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 cursor-pointer mb-6 group"
          onClick={() => router.back()}
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="text-sm font-medium">Back</span>
        </motion.div>

        {/* Header Section */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="relative">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Package className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
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
                <Plus size={16} className="text-green-600" />
              </motion.div>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Add New Grocery
          </h1>
          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
            Fill in the product details
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-lg p-5 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Product Name */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Tag
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type="text"
                  value={groceryName}
                  onChange={(e) => setGroceryName(e.target.value)}
                  placeholder="e.g., Fresh Apples"
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1e293b] text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  required
                />
              </div>
            </div>

            {/* Category & Unit Row */}
            <div className="grid grid-cols-2 gap-3">
              {/* Category Dropdown */}
              <div className="relative" ref={categoryRef}>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <div
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className={`w-full flex items-center justify-between pl-3 pr-3 py-2.5 text-sm rounded-lg border cursor-pointer transition ${
                    isCategoryOpen
                      ? "border-blue-500 ring-2 ring-blue-500/20"
                      : "border-slate-300 dark:border-slate-700 hover:border-blue-300"
                  } bg-white dark:bg-[#1e293b] text-slate-900 dark:text-slate-100`}
                >
                  <div className="flex items-center gap-2">
                    {selectedCategory && selectedCategory.icon}
                    <span>
                      {selectedCategory ? selectedCategory.label : "Select"}
                    </span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 transition-transform duration-200 ${
                      isCategoryOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>

                <AnimatePresence>
                  {isCategoryOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute z-50 w-full mt-1 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                    >
                      {categories.map((cat) => (
                        <div
                          key={cat.value}
                          onClick={() => {
                            setCategory(cat.value);
                            setIsCategoryOpen(false);
                            setUnit("");
                          }}
                          className={`flex items-center justify-between px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                            category === cat.value
                              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                              : "text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500">{cat.icon}</span>
                            <span>{cat.label}</span>
                          </div>
                          {category === cat.value && <Check size={14} />}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Unit Dropdown */}
              <div className="relative" ref={unitRef}>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Unit <span className="text-red-500">*</span>
                </label>
                <div
                  onClick={() => category && setIsUnitOpen(!isUnitOpen)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg border cursor-pointer transition ${
                    !category
                      ? "bg-slate-50 dark:bg-slate-800 cursor-not-allowed opacity-60 border-slate-200 dark:border-slate-700"
                      : isUnitOpen
                        ? "border-blue-500 ring-2 ring-blue-500/20"
                        : "border-slate-300 dark:border-slate-700 hover:border-blue-300"
                  } bg-white dark:bg-[#1e293b] text-slate-900 dark:text-slate-100`}
                >
                  <span>{unit || "Select"}</span>
                  {category && (
                    <ChevronDown
                      size={16}
                      className={`text-slate-400 transition-transform duration-200 ${
                        isUnitOpen ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </div>

                <AnimatePresence>
                  {isUnitOpen && category && categoryUnits[category] && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute z-50 w-full mt-1 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-48 overflow-y-auto"
                    >
                      {categoryUnits[category].map((u) => (
                        <div
                          key={u}
                          onClick={() => {
                            setUnit(u);
                            setIsUnitOpen(false);
                          }}
                          className={`flex items-center justify-between px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                            unit === u
                              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                              : "text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                        >
                          <span>{u}</span>
                          {unit === u && <Check size={14} />}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Price <span className="text-red-500">*</span> (₹)
              </label>
              <div className="relative">
                <IndianRupee
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type="text"
                  value={price}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9.]/g, "");
                    setPrice(value);
                  }}
                  placeholder="0.00"
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1e293b] text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  required
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Product Image
              </label>
              <div>
                {imagePreview ? (
                  <div className="relative inline-block">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-blue-200 dark:border-blue-800">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <label className="relative block w-full border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6 hover:border-blue-500 transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="text-center">
                      <Upload className="mx-auto h-8 w-8 text-slate-400" />
                      <div className="mt-2">
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          Click to upload
                        </span>
                        <p className="text-xs text-slate-500 mt-1">
                          PNG, JPG, GIF (Max 10MB)
                        </p>
                      </div>
                    </div>
                  </label>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Package size={18} />
                  <span>Add Grocery</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
