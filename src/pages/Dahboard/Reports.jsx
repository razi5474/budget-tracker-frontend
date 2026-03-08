import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../../components/Sidebar";
import api from "../../utils/api";
import { Bar } from "react-chartjs-2";
import { FiTrendingUp, FiCalendar, FiDownload, FiBarChart2 } from "react-icons/fi";
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

const Reports = () => {
  const [categories, setCategories] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const monthKey = `${selectedYear}-${selectedMonth.toString().padStart(2, "0")}`;

      const [catRes, budgetRes, expRes] = await Promise.all([
        api.get("/category"),
        api.get(`/budget?month=${monthKey}`),
        api.get(`/expense?month=${monthKey}`)
      ]);

      const cats = catRes.data;
      const budgets = budgetRes.data;
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [selectedMonth, selectedYear]);

  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const chartData = {
    labels: categories.map(c => c.name),
    datasets: [
      {
        label: "Budget",
        data: categories.map(c => c.limit),
        backgroundColor: "#cbd5e1",
        borderRadius: 8,
      },
      {
        label: "Spent",
        data: categories.map(c => c.spent),
        backgroundColor: "#fbbf24",
        borderRadius: 8,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: "top",
        labels: { font: { weight: 'bold', family: 'Inter' }, usePointStyle: true, padding: 20 }
      },
    },
    scales: {
      y: { grid: { display: false }, border: { display: false } },
      x: { grid: { display: false }, border: { display: false } }
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />

      <motion.main 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 lg:ml-[280px] p-4 md:p-8 lg:p-12"
      >
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-3 text-amber-500 font-bold uppercase tracking-widest text-xs mb-2">
                <FiTrendingUp /> Analytical intelligence
              </div>
              <h1 className="text-4xl font-black text-slate-800 tracking-tight">FinTrack Analytics</h1>
            </div>

            <div className="flex bg-white p-2 rounded-2xl shadow-sm border border-slate-100 gap-2">
              <select
                className="bg-transparent font-bold text-slate-600 px-4 py-2 outline-none cursor-pointer hover:bg-slate-50 rounded-xl transition-colors"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              >
                {months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
              </select>
              <div className="w-px h-6 bg-slate-200 self-center" />
              <input
                type="number"
                className="bg-transparent font-bold text-slate-600 px-4 py-2 w-24 outline-none cursor-pointer hover:bg-slate-50 rounded-xl transition-colors text-center"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              />
            </div>
          </div>

          {categories.length > 0 ? (
            <div className="space-y-8">
              {/* Visual Insights */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-8 rounded-[3rem] premium-shadow border border-white/40 h-[400px]"
              >
                <div className="flex items-center gap-2 mb-6 text-slate-400 font-bold uppercase tracking-tighter text-xs">
                  <FiBarChart2 /> Budget vs Expenditure
                </div>
                <div className="h-[300px]">
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </motion.div>

              {/* Data Table */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass rounded-[3rem] premium-shadow border border-white/40 overflow-hidden"
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="px-8 py-6 font-black text-xs uppercase tracking-widest text-slate-400">Category</th>
                        <th className="px-8 py-6 font-black text-xs uppercase tracking-widest text-slate-400 text-right">Drafted</th>
                        <th className="px-8 py-6 font-black text-xs uppercase tracking-widest text-slate-400 text-right">Invested</th>
                        <th className="px-8 py-6 font-black text-xs uppercase tracking-widest text-slate-400 text-right">Variance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {categories.map(c => (
                        <tr key={c._id} className="hover:bg-amber-50/30 transition-colors group">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                              <span className="font-bold text-slate-800">{c.name}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right font-semibold text-slate-500">₹{c.limit.toLocaleString()}</td>
                          <td className="px-8 py-6 text-right font-black text-slate-900">₹{c.spent.toLocaleString()}</td>
                          <td className={`px-8 py-6 text-right font-black ${c.remaining < 0 ? "text-red-500" : "text-emerald-500"}`}>
                            {c.remaining < 0 ? "-" : "+"}₹{Math.abs(c.remaining).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-32 glass rounded-[3rem] border border-white/40"
            >
              <FiCalendar size={48} className="mx-auto text-slate-200 mb-6" />
              <p className="text-slate-400 font-bold mb-0 text-xl">Historical silence.</p>
              <p className="text-slate-300">No records found for the selected timeline.</p>
            </motion.div>
          )}
        </div>
      </motion.main>
    </div>
  );
};

export default Reports;
