import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiAlertTriangle, FiArrowLeft, FiCompass } from "react-icons/fi";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl max-h-[600px] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="text-center relative z-10 max-w-xl">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="inline-flex p-6 rounded-[2.5rem] bg-white/5 border border-white/10 shadow-3xl mb-12 relative group"
        >
          <FiCompass size={64} className="text-amber-400 group-hover:rotate-45 transition-transform duration-700 ease-in-out" />
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -top-2 -right-2 p-2 bg-red-500 rounded-full border-4 border-[#0f172a]"
          >
            <FiAlertTriangle size={16} className="text-white" />
          </motion.div>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-8xl font-black text-white tracking-tighter mb-4 selection:bg-amber-500 selection:text-slate-900"
        >
          404
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4 mb-12"
        >
          <h2 className="text-2xl font-bold text-slate-200">Sector Uncharted</h2>
          <p className="text-slate-500 font-medium text-lg leading-relaxed">
            The coordinates you provided do not correspond to any known feature. 
            You've drifted into the void.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link to="/dashboard">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-white text-slate-900 font-black rounded-3xl shadow-2xl shadow-white/10 flex items-center gap-3 mx-auto transition-all hover:bg-amber-400"
            >
              <FiArrowLeft className="stroke-[3px]" />
              Return to Station
            </motion.button>
          </Link>
        </motion.div>

        {/* Decorative Grid */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
