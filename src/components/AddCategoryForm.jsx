import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../utils/api"; // adjust path

const AddCategoryForm = ({ onClose, category }) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#ff0000");
  const [loading, setLoading] = useState(false);

  // Prefill form if editing
  useEffect(() => {
    if (category) {
      setName(category.name);
      setColor(category.color || "#ff0000");
    } else {
      setName("");
      setColor("#ff0000");
    }
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return toast.error("Enter category name");

    setLoading(true);
    try {
      if (category) {
        // Update existing category
        await api.put(`category/update/${category._id}`, { name, color });
        toast.success("Category updated");
      } else {
        // Add new category
        await api.post("category/add", { name, color });
        toast.success("Category added");
      }
      onClose(); // close modal and refresh
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save category");
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
          {category ? "Edit Category" : "Add Category"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-700">Category Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border px-3 py-2 rounded-md"
              placeholder="Enter category name"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700">Color</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full h-10 border rounded-md"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md text-black font-semibold transition ${
              loading ? "bg-gray-300" : "bg-[--color-primary] hover:bg-yellow-500"
            }`}
          >
            {loading ? "Saving..." : category ? "Update Category" : "Save Category"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryForm;
