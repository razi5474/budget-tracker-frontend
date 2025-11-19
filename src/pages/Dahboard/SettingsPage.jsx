import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import CategorySettings from "./CategorySettings";
import BudgetSettings from "./BudgetSettings"; // we’ll create this

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("categories");

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 lg:ml-64 p-6">
        {/* Tabs */}
        <div className="flex gap-4 mb-4">
          <button
            className={`px-4 py-2 rounded ${activeTab === "categories" ? "bg-primary text-white" : "bg-gray-200"}`}
            onClick={() => setActiveTab("categories")}
          >
            Categories
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === "budgets" ? "bg-primary text-white" : "bg-gray-200"}`}
            onClick={() => setActiveTab("budgets")}
          >
            Budgets
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "categories" && <CategorySettings />}
        {activeTab === "budgets" && <BudgetSettings />}
      </div>
    </div>
  );
};

export default SettingsPage;
