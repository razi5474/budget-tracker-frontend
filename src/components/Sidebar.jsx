import React, { useState } from "react";
import { FiHome, FiPieChart, FiSettings, FiMenu, FiLogOut, FiX } from "react-icons/fi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { GiCash } from "react-icons/gi";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: <FiHome size={20} /> },
    { path: "/reports", label: "Reports", icon: <FiPieChart size={20} /> },
    { path: "/settings", label: "Settings", icon: <FiSettings size={20} /> },
  ];

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        className="lg:hidden fixed top-6 left-6 z-[60] p-3 rounded-xl glass-dark text-amber-400 shadow-xl border border-white/20 active:scale-95 transition-transform"
        onClick={() => setOpen(!open)}
      >
        {open ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Backdrop for Mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        initial={false}
        animate={{ 
          x: open ? 0 : (window.innerWidth < 1024 ? -300 : 0),
          width: 280
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed top-0 left-0 h-full z-50 bg-[#0f172a] text-white overflow-hidden border-r border-white/5 shadow-2xl"
      >
        <div className="flex flex-col h-full">
          {/* Brand Logo */}
          <div className="p-8 mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-2.5 rounded-2xl shadow-lg shadow-amber-500/20">
                <GiCash size={28} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white leading-none">FinTrack</h2>
                <p className="text-[10px] uppercase tracking-widest text-amber-500 mt-1 font-semibold">Premium Expense Manager</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3.5 px-5 py-3.5 rounded-2xl transition-all duration-300 group relative ${
                    isActive 
                      ? "bg-white/10 text-amber-400 shadow-inner" 
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-amber-400/5 border-l-2 border-amber-400 rounded-2xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className={`relative z-10 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
                    {item.icon}
                  </span>
                  <span className="relative z-10 font-semibold text-sm tracking-wide">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Footer / Logout */}
          <div className="p-6 mt-auto">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3.5 px-5 py-4 rounded-2xl text-slate-400 font-semibold transition-all hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20 group"
            >
              <div className="bg-white/5 p-2 rounded-xl group-hover:bg-red-500/10 transition-colors">
                <FiLogOut size={18} />
              </div>
              <span className="text-sm">Logout Session</span>
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
