import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../../components/Sidebar";
import SummeryCard from "../../components/SummeryCard";
import Categorylist from "../../components/Categorylist";
import BudgetList from "../../components/BudgetList";
import ExpencseList from "../../components/ExpencseList";
import Report from "../../components/Report";
import { GiExpense, GiWallet, GiReceiveMoney } from "react-icons/gi";
import DashboardHeader from "../../components/DashboardHeader";
import AddExpenseButton from "../../components/AddExpenseButton";
import AddExpenseForm from "../../components/AddExpenseForm";
import api from "../../utils/api";

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const Home = () => {
  const today = new Date();
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  const [totalBudget, setTotalBudget] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
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
      const expData = expRes.data;

      const budgetsMap = {};
      budgets.forEach(b => {
        if (b.categoryID) {
          const catId = typeof b.categoryID === "object" ? b.categoryID._id : b.categoryID;
          budgetsMap[catId] = b.limit;
        }
      });

      const updatedCategories = cats.map(c => {
        const spent = expData
          .filter(e => {
            if (!e.categoryID) return false;
            const catId = typeof e.categoryID === "object" ? e.categoryID._id : e.categoryID;
            return catId === c._id;
          })
          .reduce((sum, e) => sum + (e.amount || 0), 0);

        const limit = budgetsMap[c._id] || 0;
        return { ...c, spent, limit };
      });

      setCategories(updatedCategories);
      setExpenses(expData);

      const totalBudgetCalc = updatedCategories.reduce((sum, c) => sum + (c.limit || 0), 0);
      const totalExpensesCalc = expData.reduce((sum, e) => sum + (e.amount || 0), 0);
      
      setTotalBudget(totalBudgetCalc);
      setTotalExpenses(totalExpensesCalc);
      setBalance(totalBudgetCalc - totalExpensesCalc);

    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedMonth, selectedYear]);

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />

      <motion.main 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 lg:ml-[280px] p-4 md:p-8 lg:p-12"
      >
        {/* Header Section */}
        <section className="mb-10">
          <DashboardHeader
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            setSelectedMonth={setSelectedMonth}
            setSelectedYear={setSelectedYear}
          />
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <SummeryCard title="Total Budget" amount={totalBudget} icon={<GiReceiveMoney />} delay={0.1} />
          <SummeryCard title="Total Expenses" amount={totalExpenses} icon={<GiExpense />} delay={0.2} />
          <SummeryCard title="Balance Remaining" amount={balance} icon={<GiWallet />} delay={0.3} />
        </section>

        {/* Content Tabs/Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Categories Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="xl:col-span-2"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800 tracking-tight">Financial Overview</h3>
            </div>
            {categories.length > 0 ? (
              <div className="glass p-6 rounded-[2.5rem] premium-shadow border border-white/40">
                <Categorylist categories={categories} />
              </div>
            ) : (
              <div className="glass p-12 rounded-[2.5rem] text-center border border-white/40">
                <p className="text-slate-400 font-medium italic">No data available for this period.</p>
              </div>
            )}
          </motion.div>

          {/* Recent Activity Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col"
          >
            <h3 className="text-xl font-bold text-slate-800 tracking-tight mb-6">Recent Activity</h3>
            <div className="glass p-6 rounded-[2.5rem] flex-1 premium-shadow border border-white/40 overflow-hidden">
              {expenses.length > 0 ? (
                <ExpencseList expenses={expenses} onUpdate={fetchDashboardData} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <GiExpense size={48} className="mb-4 opacity-20" />
                  <p className="font-medium">All clear for today!</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Reports & Exports */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <Report />
        </motion.section>

        {/* Action Button */}
        <div className="fixed bottom-8 right-8 z-[100]">
          <AddExpenseButton onOpen={() => setShowForm(true)} />
        </div>

        {/* Modals */}
        <AnimatePresence>
          {showForm && (
            <AddExpenseForm
              onClose={() => setShowForm(false)}
              refreshDashboard={fetchDashboardData}
            />
          )}
        </AnimatePresence>
      </motion.main>
    </div>
  );
};

export default Home;
