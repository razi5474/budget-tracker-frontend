import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../../utils/api"; // adjust path
import AddCategoryForm from "../../components/AddCategoryForm";

const CategorySettings = () => {
  const [categories, setCategories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null); // category to edit

  const fetchCategories = async () => {
    try {
      const res = await api.get("/category");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/category/delete/${id}`);
      toast.success("Category deleted");
      fetchCategories();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete category");
    }
  };

  const handleEdit = (category) => {
    setEditCategory(category);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Categories</h2>
        <button
          className="px-4 py-2 bg-[#fcba03] text-white rounded-md"
          onClick={() => setShowAddModal(true)}
        >
          Add Category
        </button>
      </div>

      {/* Desktop Table */}
      <table className="hidden md:table w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">Name</th>
            <th className="border p-2">Color</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c._id} className="hover:bg-gray-50">
              <td className="border p-2">{c.name}</td>
              <td className="border p-2 text-center">
                <span
                  className="inline-block w-4 h-4 rounded-full"
                  style={{ backgroundColor: c.color }}
                />
              </td>
              <td className="border p-2 text-center">
                <button
                  className="mr-2 px-2 py-1 bg-yellow-400 text-white rounded-md"
                  onClick={() => handleEdit(c)}
                >
                  Edit
                </button>
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded-md"
                  onClick={() => handleDelete(c._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {categories.map((c) => (
          <div
            key={c._id}
            className="p-4 bg-white rounded-lg shadow flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: c.color }}
                />
                <span className="font-medium">{c.name}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                className="flex-1 py-1 px-2 bg-yellow-400 text-white rounded-md text-sm"
                onClick={() => handleEdit(c)}
              >
                Edit
              </button>
              <button
                className="flex-1 py-1 px-2 bg-red-500 text-white rounded-md text-sm"
                onClick={() => handleDelete(c._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Category Modal */}
      {(showAddModal || editCategory) && (
        <AddCategoryForm
          category={editCategory} // pass category for editing
          onClose={() => {
            setShowAddModal(false);
            setEditCategory(null);
            fetchCategories();
          }}
        />
      )}
    </div>
  );
};

export default CategorySettings;
