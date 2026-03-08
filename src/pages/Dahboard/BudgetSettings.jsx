import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSave, FiCalendar, FiTarget, FiCheckCircle } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../../utils/api";

const BudgetSettings = () => {
  const [categories, setCategories] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [limits, setLimits] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const resCategories = await api.get("/category");
        const cats = resCategories.data;
        setCategories(cats);

        const monthKey = `${selectedYear}-${selectedMonth.toString().padStart(2, "0")}`;
        const resBudgets = await api.get(`/budget?month=${monthKey}`);
        
        const monthBudgets = {};
        resBudgets.data.forEach(b => {
          if (b.categoryID) {
            const catId = typeof b.categoryID === "object" ? b.categoryID._id : b.categoryID;
            monthBudgets[catId] = b.limit;
          }
        });

        const initLimits = {};
        cats.forEach(cat => {
          initLimits[cat._id] = monthBudgets[cat._id] || 0;
        });
        setLimits(initLimits);
      } catch (err) {
        toast.error("Failed to sync budgets");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth, selectedYear]);

  const handleChange = (catId, value) => {
    const num = Math.max(0, parseInt(value) || 0);
    setLimits(prev => ({ ...prev, [catId]: num }));
  };

  const handleSave = async (catId) => {
    try {
      setSavingId(catId);
      const monthKey = `${selectedYear}-${selectedMonth.toString().padStart(2, "0")}`;
      await api.post(`/budget/add`, {
        categoryID: catId,
        limit: limits[catId],
        month: monthKey,
      });
      toast.success("Allocation locked");
    } catch (err) {
      toast.error("Failed to commit budget");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
          <div className="flex items-center gap-3 text-amber-500 font-bold uppercase tracking-widest text-xs mb-2">
            <FiTarget /> Precision Planning
          </div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Budget Strategy</h1>
          <p className="text-slate-500 font-medium mt-1 text-lg">Allocate resources for {months[selectedMonth-1]} {selectedYear}</p>
        </div>

        <div className="flex bg-white p-2 rounded-2xl shadow-sm border border-slate-100 gap-2">
          <select
            className="bg-transparent font-bold text-slate-600 px-6 py-3 outline-none cursor-pointer hover:bg-slate-50 rounded-xl transition-colors"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          >
            {months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
          </select>
          <div className="w-px h-8 bg-slate-200 self-center" />
          <input
            type="number"
            className="bg-transparent font-bold text-slate-600 px-6 py-3 w-32 outline-none cursor-pointer hover:bg-slate-50 rounded-xl transition-colors text-center"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          {[1,2,3,4].map(n => <div key={n} className="h-24 bg-slate-100 rounded-3xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {categories.map((cat, index) => (
              <motion.div
                key={cat._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass p-6 rounded-[2.5rem] premium-shadow border border-white/40 group hover:border-amber-400/30 transition-all"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner"
                    style={{ backgroundColor: `${cat.color}15` }}
                  >
                    <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: cat.color }} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 tracking-tight">{cat.name}</h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-400">₹</span>
                    <input
                      type="number"
                      value={limits[cat._id] || ""}
                      onChange={(e) => handleChange(cat._id, e.target.value)}
                      placeholder="0"
                      className="w-full bg-white/50 border border-slate-100 px-10 py-5 rounded-2xl focus:ring-2 focus:ring-amber-400/50 outline-none transition-all font-black text-lg text-slate-900"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSave(cat._id)}
                    disabled={savingId === cat._id}
                    className={`p-5 rounded-2xl transition-all shadow-lg ${
                      savingId === cat._id 
                        ? "bg-slate-100 text-slate-300" 
                        : "bg-[#0f172a] text-white hover:bg-slate-800 shadow-slate-200"
                    }`}
                  >
                    {savingId === cat._id ? (
                      <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
                    ) : (
                      <FiSave size={24} className="stroke-[2.5px]" />
                    )}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {!loading && categories.length === 0 && (
        <div className="text-center py-24 glass rounded-[3rem] border-2 border-dashed border-slate-200">
          <FiCalendar size={48} className="mx-auto text-slate-200 mb-6" />
          <p className="text-slate-400 font-bold text-xl">System idle.</p>
          <p className="text-slate-300">Define categories first to set up your financial targets.</p>
        </div>
      )}
    </div>
  );
};

export default BudgetSettings;
