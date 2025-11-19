import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../utils/api";

const AddExpenseForm = ({ onClose, refreshDashboard }) => {
  const today = new Date().toISOString().split("T")[0];

  const [categories, setCategories] = useState([]);
  const [categoryID, setCategoryID] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(today);
  const [loading, setLoading] = useState(false);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/category");
        setCategories(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  const selectedCategory = categories.find((c) => c._id === categoryID);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryID || !amount || !date) {
      toast.error("Please fill all fields");
      return;
    }

    if (Number(amount) <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/expense/add", {
        categoryID,
        amount: Number(amount),
        date,
      });

      const data = res.data;

      if (data.status === "over-budget") toast.error("Over Budget!");
      else if (data.status === "within-budget") toast.success("Expense Added!");
      else if (data.status === "no-budget")
        toast("Expense added, but no budget set");

      if (refreshDashboard) refreshDashboard();

      // Reset form
      setCategoryID("");
      setAmount("");
      setDate(today);

      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-4">
      <div className="bg-white w-full max-w-sm p-6 rounded-xl shadow-xl relative animate-fade-up">
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-black"
          onClick={onClose}
        >
          <FiX size={22} />
        </button>

        <h2 className="text-xl font-semibold mb-5 text-gray-800 text-center">
          Add Expense
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Dropdown */}
          <div>
            <label className="block mb-1 text-gray-700">Category</label>
            <select
              required
              value={categoryID}
              onChange={(e) => setCategoryID(e.target.value)}
              className="w-full border px-3 py-2 rounded-md"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Color Preview */}
          {selectedCategory && (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-gray-600">Category Color:</span>
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: selectedCategory.color }}
              />
            </div>
          )}

          {/* Amount */}
          <div>
            <label className="block mb-1 text-gray-700">Amount</label>
            <input
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border px-3 py-2 rounded-md"
              placeholder="Enter amount"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block mb-1 text-gray-700">Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md text-black font-semibold transition ${
              loading ? "bg-gray-300" : "bg-[--color-primary] hover:bg-yellow-500"
            }`}
          >
            {loading ? "Saving..." : "Save Expense"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseForm;
