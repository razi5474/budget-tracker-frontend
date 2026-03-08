import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiEdit3, FiTrash2, FiLayers } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../../utils/api";
import AddCategoryForm from "../../components/AddCategoryForm";

const CategorySettings = () => {
  const [categories, setCategories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/category");
      setCategories(res.data);
    } catch (err) {
      toast.error("Network synchronization failed");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("This will permanently remove all associated budgets and expenses. Proceed?")) return;
    try {
      await api.delete(`/category/delete/${id}`);
      toast.success("Category and associated data purged");
      fetchCategories();
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <FiLayers className="text-amber-400" /> Category Architecture
          </h2>
          <p className="text-slate-500 font-medium mt-1">Manage your financial structure and branding</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 bg-[#0f172a] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-slate-200 transition-all hover:bg-slate-800"
          onClick={() => setShowAddModal(true)}
        >
          <FiPlus className="stroke-[3px]" /> New Category
        </motion.button>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {categories.map((c, index) => (
            <motion.div
              key={c._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="glass p-6 rounded-[2.5rem] premium-shadow border border-white/40 flex flex-col justify-between group active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center gap-4 mb-8">
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner"
                  style={{ backgroundColor: `${c.color}20` }}
                >
                  <div 
                    className="w-4 h-4 rounded-full shadow-sm"
                    style={{ backgroundColor: c.color }}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 tracking-tight">{c.name}</h3>
                  <code className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{c.color}</code>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  className="flex-1 py-3 px-4 bg-white hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 border border-slate-100"
                  onClick={() => setEditCategory(c)}
                >
                  <FiEdit3 /> Edit
                </button>
                <button
                  className="flex-1 py-3 px-4 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                  onClick={() => handleDelete(c._id)}
                >
                  <FiTrash2 /> Purge
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {categories.length === 0 && (
        <div className="text-center py-20 px-4 glass rounded-[3rem] border-2 border-dashed border-slate-200">
          <FiLayers size={48} className="mx-auto text-slate-200 mb-6" />
          <p className="text-slate-400 font-bold mb-0">No categories established yet.</p>
          <p className="text-slate-300 text-sm">Start building your financial framework today.</p>
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {(showAddModal || editCategory) && (
          <AddCategoryForm
            category={editCategory}
            onClose={() => {
              setShowAddModal(false);
              setEditCategory(null);
              fetchCategories();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategorySettings;
