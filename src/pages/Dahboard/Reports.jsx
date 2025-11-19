import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import api from "../../utils/api";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Report = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const fetchReportData = async () => {
    try {
      const catRes = await api.get("/category");
      const cats = catRes.data;

      const monthKey = `${selectedYear}-${selectedMonth.toString().padStart(2, "0")}`;

      const budgetRes = await api.get(`/budget?month=${monthKey}`);
      const budgets = budgetRes.data;

      const expRes = await api.get(`/expense?month=${monthKey}`);
      const expenses = expRes.data;

      const budgetsMap = {};
      budgets.forEach(b => {
        if (b.categoryID) {
          const catId = typeof b.categoryID === "object" ? b.categoryID._id : b.categoryID;
          budgetsMap[catId] = b.limit;
        }
      });

      const reportCategories = cats.map(c => {
        const spent = expenses
          .filter(e => {
            if (!e.categoryID) return false;
            const catId = typeof e.categoryID === "object" ? e.categoryID._id : e.categoryID;
            return catId === c._id;
          })
          .reduce((sum, e) => sum + (e.amount || 0), 0);

        const limit = budgetsMap[c._id] || 0;
        const remaining = limit - spent;

        return { ...c, spent, limit, remaining };
      });

      setCategories(reportCategories);
    } catch (err) {
      console.error("Report fetch error:", err);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [selectedMonth, selectedYear]);

  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  // Chart data
  const chartData = {
    labels: categories.map(c => c.name),
    datasets: [
      {
        label: "Budget",
        data: categories.map(c => c.limit),
        backgroundColor: "rgba(59, 130, 246, 0.7)"
      },
      {
        label: "Spent",
        data: categories.map(c => c.spent),
        backgroundColor: "rgba(220, 38, 38, 0.7)"
      },
      {
        label: "Remaining",
        data: categories.map(c => c.remaining),
        backgroundColor: "rgba(16, 185, 129, 0.7)"
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Monthly Budget Report" }
    },
    scales: { y: { beginAtZero: true } }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 overflow-y-auto p-4 md:p-6">
        {/* Mobile toggle */}
        <div className="lg:hidden mb-4">
          <button
            className="px-3 py-2 bg-primary text-white rounded-md"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "Close Menu" : "Open Menu"}
          </button>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Reports - {months[selectedMonth - 1]} {selectedYear}
          </h1>
          <div className="flex gap-3 mt-2 md:mt-0">
            <select
              className="border rounded-md px-3 py-2"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            >
              {months.map((m, i) => (
                <option key={i} value={i + 1}>{m}</option>
              ))}
            </select>
            <input
              type="number"
              className="w-24 border rounded-md px-3 py-2"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            />
          </div>
        </div>

        {/* Content */}
        {categories.length ? (
          <div className="space-y-6">
            {/* Chart */}
            <div className="overflow-x-auto">
              <Bar data={chartData} options={chartOptions} />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 rounded-md">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Category</th>
                    <th className="px-4 py-2 text-right">Budget</th>
                    <th className="px-4 py-2 text-right">Spent</th>
                    <th className="px-4 py-2 text-right">Remaining</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(c => (
                    <tr key={c._id} className="border-t">
                      <td className="px-4 py-2">{c.name}</td>
                      <td className="px-4 py-2 text-right">{c.limit}</td>
                      <td className="px-4 py-2 text-right">{c.spent}</td>
                      <td className={`px-4 py-2 text-right ${c.remaining < 0 ? "text-red-600 font-bold" : ""}`}>
                        {c.remaining}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-6">
            No budget or expenses available for this month.
          </p>
        )}
      </div>
    </div>
  );
};

export default Report;
