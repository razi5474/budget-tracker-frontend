import React, { useState, useEffect } from "react";
import { FiX, FiPlus, FiChevronDown } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../utils/api";

const AddExpenseForm = ({ onClose, refreshDashboard }) => {
  const today = new Date().toISOString().split("T")[0];

  const [categories, setCategories] = useState([]);
  const [categoryID, setCategoryID] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(today);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/category");
        setCategories(res.data);
      } catch (err) {
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  const selectedCategory = categories.find((c) => c._id === categoryID);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryID || !amount || !date) {
      toast.error("Please fill all fields");
      return;
    }
    if (Number(amount) <= 0) {
      toast.error("Amount must be positive");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/expense/add", {
        categoryID,
        amount: Number(amount),
        date,
      });

      if (res.data.status === "over-budget") toast.error("Budget Exceeded!");
      else toast.success("Transaction Recorded");

      if (refreshDashboard) refreshDashboard();
      onClose();
    } catch (err) {
      toast.error("Failed to record expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[110] px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="glass-dark w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl relative border border-white/10"
      >
        <button
          className="absolute top-6 right-6 p-2 rounded-xl hover:bg-white/10 text-slate-400 transition-colors"
          onClick={onClose}
        >
          <FiX size={20} />
        </button>

        <div className="mb-8">
          <h2 className="text-2xl font-black text-white tracking-tight">Record Expense</h2>
          <p className="text-slate-400 text-sm font-medium mt-1">Track your spending for better insights</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
            <div className="relative group">
              <select
                required
                value={categoryID}
                onChange={(e) => setCategoryID(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white px-5 py-4 rounded-2xl appearance-none focus:ring-2 focus:ring-amber-400/50 outline-none transition-all font-semibold"
              >
                <option value="" className="bg-slate-900">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id} className="bg-slate-900">
                    {c.name}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-amber-400 transition-colors" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Amount</label>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-white/5 border border-white/10 text-white px-5 py-4 rounded-2xl focus:ring-2 focus:ring-amber-400/50 outline-none transition-all font-black text-lg"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white px-5 py-4 rounded-2xl focus:ring-2 focus:ring-amber-400/50 outline-none transition-all font-semibold"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl text-slate-900 font-bold tracking-tight shadow-xl transition-all flex items-center justify-center gap-2 ${
              loading 
                ? "bg-slate-700 text-slate-400 cursor-not-allowed" 
                : "bg-gradient-to-r from-amber-400 to-orange-500 hover:shadow-amber-500/20"
            }`}
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
            ) : (
              <>
                <FiPlus className="stroke-[3px]" /> Save Transaction
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddExpenseForm;
