import React from "react";
import { motion } from "framer-motion";
import { FiCalendar, FiChevronDown } from "react-icons/fi";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DashboardHeader = ({ selectedMonth, selectedYear, setSelectedMonth, setSelectedYear }) => {
  const handleMonthChange = (e) => setSelectedMonth(parseInt(e.target.value, 10) + 1);
  const handleYearChange = (e) => setSelectedYear(parseInt(e.target.value, 10));

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
    >
      <div>
        <div className="flex items-center gap-2 text-amber-500 font-bold uppercase tracking-widest text-[10px] mb-2">
          <FiCalendar /> Ledger Timeline
        </div>
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">
          {months[selectedMonth - 1]} <span className="text-slate-400">{selectedYear}</span>
        </h1>
      </div>

      <div className="flex bg-white p-2 rounded-2xl shadow-sm border border-slate-100 gap-2 self-start md:self-auto">
        <div className="relative group">
          <select
            className="bg-transparent font-bold text-slate-600 px-5 py-3 pr-10 outline-none cursor-pointer hover:bg-slate-50 rounded-xl transition-all appearance-none"
            value={selectedMonth - 1}
            onChange={handleMonthChange}
          >
            {months.map((m, i) => (
              <option key={i} value={i}>{m}</option>
            ))}
          </select>
          <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-amber-500 transition-colors" />
        </div>
        <div className="w-px h-6 bg-slate-200 self-center" />
        <input
          type="number"
          value={selectedYear}
          onChange={handleYearChange}
          className="bg-transparent font-bold text-slate-600 px-5 py-3 w-28 outline-none cursor-pointer hover:bg-slate-50 rounded-xl transition-all text-center"
        />
      </div>
    </motion.div>
  );
};

export default DashboardHeader;
