import React from 'react'
import { motion } from "framer-motion";
import { FiArrowRight, FiPieChart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Report = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass p-10 rounded-[3rem] premium-shadow border border-white/40 flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-br from-white/40 to-amber-50/20"
    >
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 rounded-[2rem] bg-amber-400 flex items-center justify-center text-slate-900 shadow-lg shadow-amber-400/20">
          <FiPieChart size={32} />
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Financial Intelligence</h3>
          <p className="text-slate-500 font-medium">Deep dive into your spending patterns and trends</p>
        </div>
      </div>

      <motion.button
        whileHover={{ x: 5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/reports")}
        className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold transition-all hover:bg-slate-800 shadow-xl shadow-slate-200 group"
      >
        Explore Reports <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
      </motion.button>
    </motion.div>
  )
}

export default Report
