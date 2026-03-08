import React, { useState, useEffect } from "react";
import { FiX, FiCheck, FiTag } from "react-icons/fi";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../utils/api";

const AddCategoryForm = ({ onClose, category }) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#fbbf24");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setColor(category.color || "#fbbf24");
    }
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name is required");

    setLoading(true);
    try {
      if (category) {
        await api.put(`category/update/${category._id}`, { name, color });
        toast.success("Category refined");
      } else {
        await api.post("category/add", { name, color });
        toast.success("New category established");
      }
      onClose();
    } catch (err) {
      toast.error("Process failed");
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
        className="glass-dark w-full max-w-sm p-8 rounded-[2.5rem] shadow-2xl relative border border-white/10"
      >
        <button
          className="absolute top-6 right-6 p-2 rounded-xl hover:bg-white/10 text-slate-400 transition-colors"
          onClick={onClose}
        >
          <FiX size={20} />
        </button>

        <div className="mb-8">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/10 flex items-center justify-center mb-4 border border-amber-400/20">
            <FiTag className="text-amber-400" size={24} />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {category ? "Edit Category" : "New Category"}
          </h2>
          <p className="text-slate-400 text-sm font-medium mt-1">Organize your finances with precision</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Identity</label>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white px-5 py-4 rounded-2xl focus:ring-2 focus:ring-amber-400/50 outline-none transition-all font-semibold"
              placeholder="e.g. Lifestyle, Travel"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Branding Color</label>
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-12 h-12 rounded-xl border-none bg-transparent cursor-pointer overflow-hidden p-0"
              />
              <div className="flex-1">
                <p className="text-xs font-bold text-white uppercase tracking-tighter">{color}</p>
                <p className="text-[10px] text-slate-500 font-medium">Selected Theme</p>
              </div>
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
                <FiCheck className="stroke-[3px]" /> {category ? "Apply Changes" : "Create Category"}
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddCategoryForm;
