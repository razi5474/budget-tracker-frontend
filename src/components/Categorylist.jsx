import React from "react";
import CategoryCard from "./CategoryCard";
import { useNavigate } from "react-router-dom";

const CategoryList = ({ categories, onAddCategory }) => {
  const navigate = useNavigate();
  const handleAddCategory = () => {
    navigate("/settings"); // navigate to your desired route
  };
  if (!categories || !categories.length)
    return (
      <div className="mt-8 text-center">
        <p className="text-gray-600 mb-4">
          No categories found. Add some to get started!
        </p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          onClick={handleAddCategory}
        >
          Add Category
        </button>
      </div>
    );

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Budget Categories</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((c) => (
          <CategoryCard
            key={c._id}
            name={c.name}
            color={c.color}
            spent={c.spent || 0}
            limit={c.limit || 0}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
