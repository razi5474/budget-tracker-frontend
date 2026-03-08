import React from 'react'
import { motion } from "framer-motion";

const SummeryCard = ({ title, amount, icon, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="glass p-6 rounded-3xl flex items-center gap-5 premium-shadow border border-white/40 group overflow-hidden relative"
    >
      <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-500">
        {React.cloneElement(icon, { size: 120 })}
      </div>
      
      <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-4 rounded-2xl text-white shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform duration-300">
        {React.cloneElement(icon, { size: 28 })}
      </div>

      <div className="relative z-10">
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">
          ₹{amount.toLocaleString('en-IN')}
        </h2>
      </div>
    </motion.div>
  )
}

export default SummeryCard
