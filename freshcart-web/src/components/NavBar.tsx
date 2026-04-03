"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  User,
  ChevronDown,
  Package,
  List,
  ClipboardList,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import mongoose from "mongoose";
import { signOut } from "next-auth/react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface IUser {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  mobile?: string;
  role: "user" | "admin" | "deliveryBoy";
  image?: string;
}

interface NavBarProps {
  user?: IUser | null;
}

export default function NavBar({ user }: NavBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { cartData } = useSelector((state: RootState) => state.cart);

  const isAdmin = user?.role === "admin";
  const isRegularUser =
    user?.role === "user" || user?.role === "deliveryBoy" || !user;

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white dark:bg-[#020617] border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex-shrink-0"
            >
              <Link href="/" className="flex items-center gap-1">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  Fresh
                </span>
                <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Cart
                </span>
              </Link>
            </motion.div>

            {/* Search Bar - Desktop (only for non-admin users) */}
            {!isAdmin && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="hidden md:flex flex-1 max-w-md mx-4"
              >
                <div className="relative w-full">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search groceries..."
                    className="w-full pl-4 pr-10 py-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20 transition-all"
                  />
                  <Search
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                </div>
              </motion.div>
            )}

            {/* Right side icons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center md:gap-2 lg:gap-4"
            >
              {/* Search Icon - Mobile (only for non-admin users) */}
              {!isAdmin && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsSearchVisible(!isSearchVisible)}
                  className="md:hidden relative p-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-full bg-slate-100 dark:bg-slate-800 mr-4"
                >
                  <Search size={20} />
                </motion.button>
              )}

              {/* Cart Icon (only for non-admin users) */}
              {!isAdmin && (
                <Link href="/user/cart" >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-full bg-slate-100 dark:bg-slate-800 mr-2"
                >
                  <ShoppingCart size={20} />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full text-[10px] text-white flex items-center justify-center">
                    {cartData.length}
                  </span>
                </motion.button>
                </Link>
              )}

              {/* Admin Buttons - Desktop Dock */}
              {isAdmin && (
                <div className="hidden md:flex items-center gap-1 p-1 bg-slate-100/80 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 mr-4">
                  <Link href="/admin/add-grocery">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-md transition-all"
                    >
                      <Package
                        size={16}
                        className="text-blue-600 dark:text-blue-400"
                      />
                      <span>Add Grocery</span>
                    </motion.button>
                  </Link>

                  <Link href="/admin/view-grocery">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-md transition-all"
                    >
                      <List
                        size={16}
                        className="text-emerald-600 dark:text-emerald-400"
                      />
                      <span>View Grocery</span>
                    </motion.button>
                  </Link>

                  <Link href="/admin/manage-orders">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-500/10 rounded-md transition-all"
                    >
                      <ClipboardList
                        size={16}
                        className="text-purple-600 dark:text-purple-400"
                      />
                      <span>Manage Orders</span>
                    </motion.button>
                  </Link>
                </div>
              )}

              {/* Profile Dropdown - Desktop */}
              <div className="hidden md:block relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onHoverStart={() => setIsProfileOpen(true)}
                  onHoverEnd={() => setIsProfileOpen(false)}
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="focus:outline-none"
                >
                  {user?.image ? (
                    <Image
                      src={user.image}
                      alt={user.name}
                      width={34}
                      height={34}
                      className="rounded-full ring-2 ring-blue-100 dark:ring-blue-500/30"
                    />
                  ) : (
                    <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                      <User size={18} className="text-white" />
                    </div>
                  )}
                </motion.button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      onHoverStart={() => setIsProfileOpen(true)}
                      onHoverEnd={() => setIsProfileOpen(false)}
                      className="absolute right-0 mt-5 w-64 bg-white dark:bg-[#1e293b] rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden backdrop-blur-sm backdrop-filter"
                    >
                      {/* User Info Card */}
                      <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                          {user?.image ? (
                            <Image
                              src={user.image}
                              alt={user.name}
                              width={48}
                              height={48}
                              className="rounded-full ring-2 ring-white dark:ring-slate-800"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                              <User size={22} className="text-white" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                              {user?.name || "Guest User"}
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                              {user?.email || "guest@example.com"}
                            </p>
                            {user?.role && (
                              <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-medium bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 rounded-full">
                                {user.role === "admin"
                                  ? "Administrator"
                                  : user.role === "deliveryBoy"
                                    ? "Delivery Partner"
                                    : "Customer"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Menu Items - Only show for non-admin users */}
                      {!isAdmin && (
                        <div className="p-2">
                          <Link
                            href="/user/my-order"
                            className="flex items-center gap-2 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors group"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <svg
                              className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                              />
                            </svg>
                            <span>My Orders</span>
                          </Link>
                        </div>
                      )}

                      {/* Divider */}
                      <div className="h-px bg-slate-200 dark:bg-slate-700 mx-2"></div>

                      {/* Logout Button */}
                      <div className="p-2">
                        <button
                          onClick={() => {
                            console.log("Logout");
                            signOut({ callbackUrl: "/login" });
                            setIsProfileOpen(false);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors group"
                        >
                          <svg
                            className="w-4 h-4 group-hover:scale-110 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile menu button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.button>
            </motion.div>
          </div>

          {/* Mobile Search Bar - Hideable (only for non-admin users) */}
          {!isAdmin && (
            <AnimatePresence>
              {isSearchVisible && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="md:hidden overflow-hidden"
                >
                  <div className="py-3">
                    <div className="relative w-full">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search groceries..."
                        className="w-full pl-12 pr-12 py-3.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-500/20 transition-all shadow-sm"
                      />
                      <Search
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 dark:text-blue-400"
                        size={20}
                      />
                      <button
                        onClick={() => setIsSearchVisible(false)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        <X
                          size={18}
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f1729] overflow-hidden"
            >
              <div className="px-5 py-4">
                {/* Mobile Profile Card */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl p-5 mb-4 border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center gap-4">
                    {user?.image ? (
                      <Image
                        src={user.image}
                        alt={user.name}
                        width={56}
                        height={56}
                        className="rounded-full ring-2 ring-white dark:ring-slate-800"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                        <User size={28} className="text-white" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        {user?.name || "Guest User"}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                        {user?.email || "guest@example.com"}
                      </p>
                      {user?.role && (
                        <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 rounded-full">
                          {user.role === "admin"
                            ? "Administrator"
                            : user.role === "deliveryBoy"
                              ? "Delivery Partner"
                              : "Customer"}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Mobile Menu Items */}
                <div className="space-y-2">
                  {/* Admin Mobile Buttons */}
                  {isAdmin && (
                    <>
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.15 }}
                      >
                        <Link
                          href="/admin/add-grocery"
                          className="flex items-center gap-4 px-4 py-4 text-base text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200 w-full"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                            <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <span className="font-medium flex-1">
                            Add Grocery
                          </span>
                          <svg
                            className="w-5 h-5 text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </Link>
                      </motion.div>

                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Link
                          href="/admin/view-grocery"
                          className="flex items-center gap-4 px-4 py-4 text-base text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200 w-full"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                            <List className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <span className="font-medium flex-1">
                            View Grocery
                          </span>
                          <svg
                            className="w-5 h-5 text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </Link>
                      </motion.div>

                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.25 }}
                      >
                        <Link
                          href="/admin/manage-orders"
                          className="flex items-center gap-4 px-4 py-4 text-base text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200 w-full"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                            <ClipboardList className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <span className="font-medium flex-1">
                            Manage Orders
                          </span>
                          <svg
                            className="w-5 h-5 text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </Link>
                      </motion.div>
                    </>
                  )}

                  {/* Regular User Mobile Menu Items */}
                  {!isAdmin && (
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.15 }}
                    >
                      <Link
                        href="/user/my-order"
                        className="flex items-center gap-4 px-4 py-4 text-base text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200 w-full"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-5 h-5 text-purple-600 dark:text-purple-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                          </svg>
                        </div>
                        <span className="font-medium flex-1">My Orders</span>
                        <svg
                          className="w-5 h-5 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </motion.div>
                  )}

                  {/* Logout Button - Mobile */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <button
                      onClick={() => {
                        console.log("Logout");
                        signOut({ callbackUrl: "/login" });
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-4 w-full px-4 py-4 text-base text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all duration-200"
                    >
                      <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                      </div>
                      <span className="font-medium flex-1 text-left">
                        Logout
                      </span>
                      <svg
                        className="w-5 h-5 text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
