import React from "react";
import CategoryCard from "./CategoryCard";
import { useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { motion } from "framer-motion";

const CategoryList = ({ categories }) => {
  const navigate = useNavigate();
  
  const handleAddCategory = () => {
    navigate("/settings");
  };

  if (!categories || !categories.length)
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50/50"
      >
        <div className="bg-white p-4 rounded-2xl shadow-sm mb-4">
          <FiPlus size={32} className="text-slate-300" />
        </div>
        <p className="text-slate-500 font-bold mb-6 text-center max-w-xs">
          Your budget portfolio is empty. Start by defining your first category!
        </p>
        <button
          className="bg-amber-400 hover:bg-amber-500 text-slate-900 px-6 py-3 rounded-2xl font-black transition-all shadow-lg shadow-amber-400/20 active:scale-95 flex items-center gap-2"
          onClick={handleAddCategory}
        >
          <FiPlus /> Create Category
        </button>
      </motion.div>
    );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
        {categories.map((c, index) => (
          <CategoryCard
            key={c._id}
            name={c.name}
            color={c.color}
            spent={c.spent || 0}
            limit={c.limit || 0}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
