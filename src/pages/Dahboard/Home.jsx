import React, { useState, useEffect } from "react";
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

  // New state for summary cards
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [balance, setBalance] = useState(0);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const monthKey = `${selectedYear}-${selectedMonth.toString().padStart(2, "0")}`;

      // 1️⃣ Fetch categories
      const catRes = await api.get("/category");
      const cats = catRes.data;

      // 2️⃣ Fetch budgets
      const budgetRes = await api.get(`/budget?month=${monthKey}`);
      const budgets = budgetRes.data;

      // 3️⃣ Fetch expenses
      const expRes = await api.get(`/expense?month=${monthKey}`);
      const expData = expRes.data;

      // 4️⃣ Map budgets by categoryID
      const budgetsMap = {};
      budgets.forEach(b => {
        if (b.categoryID) {
          const catId = typeof b.categoryID === "object" ? b.categoryID._id : b.categoryID;
          budgetsMap[catId] = b.limit;
        }
      });

      // 5️⃣ Merge spent & limit into categories
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

      // 6️⃣ Calculate summary card data
      const totalBudgetCalc = updatedCategories.reduce((sum, c) => sum + (c.limit || 0), 0);
      const totalExpensesCalc = expData.reduce((sum, e) => sum + (e.amount || 0), 0);
      const balanceCalc = totalBudgetCalc - totalExpensesCalc;

      setTotalBudget(totalBudgetCalc);
      setTotalExpenses(totalExpensesCalc);
      setBalance(balanceCalc);

    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedMonth, selectedYear]);

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 lg:ml-64 p-6">
        <DashboardHeader
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          setSelectedMonth={setSelectedMonth}
          setSelectedYear={setSelectedYear}
        />

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SummeryCard title="Total Budget" amount={totalBudget} icon={<GiReceiveMoney />} />
          <SummeryCard title="Total Expenses" amount={totalExpenses} icon={<GiExpense />} />
          <SummeryCard title="Balance" amount={balance} icon={<GiWallet />} />
        </div>

        {/* Category List or no-data message */}
        {categories.length > 0 ? (
          <Categorylist categories={categories} />
        ) : (
          <div className="mt-8 text-center text-gray-600">
            No budgets or categories found for {months[selectedMonth - 1]} {selectedYear}.
          </div>
        )}

        {/* Add Expense Button */}
        <AddExpenseButton onOpen={() => setShowForm(true)} />

        {/* Expense Modal */}
        {showForm && (
          <AddExpenseForm
            onClose={() => setShowForm(false)}
            refreshDashboard={fetchDashboardData}
          />
        )}

        {/* Budget list or no-data message */}
        {expenses.length > 0 ? (
          <ExpencseList />
        ) : (
          <div className="mt-4 text-center text-gray-500">
            No expenses recorded for {months[selectedMonth - 1]} {selectedYear}.
          </div>
        )}

        {/* Report */}
        <Report />
      </div>
    </div>
  );
};

export default Home;
