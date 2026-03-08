import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiCalendar } from "react-icons/fi";
import api from "../utils/api";
import toast from "react-hot-toast";

const ExpencseList = ({ expenses, onUpdate }) => {
  const handleDelete = async (id) => {
    try {
      await api.delete(`/expense/delete/${id}`);
      toast.success("Transaction removed");
      if (onUpdate) onUpdate();
    } catch (err) {
      toast.error("Deletion failed");
    }
  };

  return (
    <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
      <AnimatePresence mode="popLayout">
        {expenses.map((expense, index) => (
          <motion.div
            key={expense._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="group flex items-center justify-between p-4 mb-3 rounded-2xl bg-white/40 border border-white/40 hover:bg-white/60 transition-all hover:shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm"
                style={{ backgroundColor: expense.categoryID?.color || "#cbd5e1" }}
              >
                <span className="font-black text-xs uppercase">
                  {expense.categoryID?.name?.charAt(0) || "E"}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm leading-tight">
                  {expense.categoryID?.name || "Uncategorized"}
                </h4>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                  <FiCalendar size={10} />
                  {new Date(expense.date).toLocaleDateString("en-IN", { 
                    day: "2-digit", 
                    month: "short" 
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-black text-slate-900 text-sm">
                ₹{expense.amount.toLocaleString()}
              </span>
              <button
                onClick={() => handleDelete(expense._id)}
                className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ExpencseList;
