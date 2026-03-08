import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../../components/Sidebar";
import CategorySettings from "./CategorySettings";
import BudgetSettings from "./BudgetSettings";
import { FiLayers, FiTarget } from "react-icons/fi";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("categories");

  const tabs = [
    { id: "categories", label: "Categories", icon: <FiLayers /> },
    { id: "budgets", label: "Budgets", icon: <FiTarget /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 lg:ml-[280px] p-4 md:p-8 lg:p-12"
      >
        <div className="max-w-6xl mx-auto">
          {/* Custom Tab Switcher */}
          <div className="flex p-1.5 bg-white/50 backdrop-blur-md rounded-2xl border border-slate-100 w-fit mb-12 shadow-sm">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                    isActive ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabBg"
                      className="absolute inset-0 bg-white shadow-md border border-slate-100 rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{tab.icon}</span>
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content with Animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "categories" ? <CategorySettings /> : <BudgetSettings />}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
