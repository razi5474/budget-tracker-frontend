import React, { useState, useEffect } from "react";
import api from "../../utils/api";

const BudgetSettings = () => {
  const [categories, setCategories] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [limits, setLimits] = useState({});

  // Fetch categories & budgets for selected month/year
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ Fetch categories
        const resCategories = await api.get("/category");
        const cats = resCategories.data;
        setCategories(cats);

        // 2️⃣ Prepare month string YYYY-MM
        const monthKey = `${selectedYear}-${selectedMonth.toString().padStart(2, "0")}`;

        // 3️⃣ Fetch budgets for selected month
        const resBudgets = await api.get(`/budget?month=${monthKey}`);
        const monthBudgets = {};
        resBudgets.data.forEach(b => {
          if (b.categoryID && b.categoryID._id) monthBudgets[b.categoryID._id] = b.limit;
        });

        // 4️⃣ Initialize limits
        const initLimits = {};
        cats.forEach(cat => {
          initLimits[cat._id] = monthBudgets[cat._id] || 0;
        });
        setLimits(initLimits);

      } catch (err) {
        console.error("BudgetSettings fetch error:", err);
        alert("Failed to fetch budgets");
      }
    };

    fetchData();
  }, [selectedMonth, selectedYear]);

  const handleChange = (catId, value) => {
    let num = parseInt(value, 10);
    if (isNaN(num) || num < 0) num = 0;
    setLimits(prev => ({ ...prev, [catId]: num }));
  };

  const handleSave = async (catId) => {
    try {
      const monthKey = `${selectedYear}-${selectedMonth.toString().padStart(2, "0")}`;

      await api.post(`/budget/add`, {
        categoryID: catId,
        limit: limits[catId],
        month: monthKey, // ✅ send in YYYY-MM format
      });

      alert("Budget updated!");
    } catch (err) {
      console.error("Save budget error:", err);
      alert("Failed to save budget");
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-xl font-semibold mb-4">
        Budgets for {selectedYear}-{selectedMonth.toString().padStart(2, "0")}
      </h2>

      {/* Month & Year selector */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <label>Month:</label>
          <input
            type="number"
            min="1"
            max="12"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
            className="border px-2 py-1 rounded w-20"
          />
        </div>
        <div className="flex items-center gap-2">
          <label>Year:</label>
          <input
            type="number"
            min="2000"
            max="2100"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
            className="border px-2 py-1 rounded w-24"
          />
        </div>
      </div>

      {/* Budgets list */}
      <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
        {categories.map(cat => (
          <div
            key={cat._id}
            className="flex items-center gap-3 p-3 border rounded-md shadow-sm"
          >
            <div
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: cat.color || "#000" }}
            />
            <span className="flex-1 font-medium">{cat.name}</span>
            <input
              type="number"
              min="0"
              value={limits[cat._id] || 0}
              onChange={(e) => handleChange(cat._id, e.target.value)}
              className="border px-2 py-1 rounded w-24 text-right"
            />
            <button
              onClick={() => handleSave(cat._id)}
              className="px-3 py-1 bg-primary text-white rounded"
            >
              Save
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetSettings;
