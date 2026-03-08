import React from "react";
import { motion } from "framer-motion";

const CategoryCard = ({ name, color, spent, limit, index }) => {
  const hasBudget = limit > 0;
  const percent = hasBudget ? Math.min((spent / limit) * 100, 100) : 0;
  const remaining = hasBudget ? limit - spent : 0;
  const overBudget = hasBudget && spent > limit;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="p-6 rounded-[2rem] bg-white/50 border border-white/60 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
    >
      <div 
        className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] -mr-8 -mt-8 rounded-full"
        style={{ backgroundColor: color }}
      />

      {/* Category Name + Color Dot */}
      <div className="flex items-center justify-between mb-5 relative z-10">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
            style={{ backgroundColor: `${color}20` }}
          >
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: color }}
            />
          </div>
          <h3 className="text-lg font-bold text-slate-800 tracking-tight">{name}</h3>
        </div>
        {hasBudget && (
          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${
            overBudget ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-600"
          }`}>
            {overBudget ? "Over" : "Tracked"}
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="mb-4 relative z-10">
        <div className="flex justify-between items-end mb-2">
          <span className="text-2xl font-black text-slate-900">
            ₹{spent.toLocaleString()}
          </span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
            / {hasBudget ? `₹${limit.toLocaleString()}` : "No Limit"}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200/50 h-2.5 rounded-full overflow-hidden backdrop-blur-sm">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 }}
            className="h-full rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)]"
            style={{ backgroundColor: color }}
          />
        </div>
      </div>

      {/* Remaining logic */}
      <div className="flex items-center justify-between relative z-10">
        {hasBudget ? (
          <p className={`text-xs font-bold ${overBudget ? "text-red-500" : "text-slate-500"}`}>
            {overBudget ? "Exceeded by " : "Remaining "}
            <span className="text-sm font-black ml-1">
              ₹{Math.abs(remaining).toLocaleString()}
            </span>
          </p>
        ) : (
          <p className="text-xs font-bold text-slate-400 italic">No budget limit set</p>
        )}
      </div>
    </motion.div>
  );
};

export default CategoryCard;
