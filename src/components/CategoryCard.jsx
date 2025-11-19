import React from "react";

const CategoryCard = ({ name, color, spent, limit }) => {
  const hasBudget = limit > 0;
  const percent = hasBudget ? Math.min((spent / limit) * 100, 100) : 0;
  const remaining = hasBudget ? limit - spent : 0;
  const overBudget = hasBudget && spent > limit;

  return (
    <div className="p-4 rounded-xl shadow-md bg-white border hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer">

      {/* Category Name + Color Dot */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
        <span
          className="w-4 h-4 rounded-full border"
          style={{ backgroundColor: color }}
        ></span>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div
            className="h-2 rounded-full transition-all"
            style={{
              width: `${percent}%`,
              backgroundColor: color,
            }}
          />
        </div>
      </div>

      {/* Spent / Limit */}
      <p className="mt-3 text-sm text-gray-700">
        <span className="font-semibold">{spent}</span> / {hasBudget ? limit : "-"}
      </p>

      {/* Remaining or Overbudget */}
      <div className="mt-2">
        {!hasBudget ? (
          <span className="text-gray-500 text-xs bg-gray-100 px-2 py-1 rounded-md font-semibold">
            No budget set
          </span>
        ) : overBudget ? (
          <span className="text-red-600 text-xs bg-red-100 px-2 py-1 rounded-md font-semibold">
            OVER BUDGET
          </span>
        ) : (
          <p className="text-sm text-gray-700">
            Remaining: <span className="font-semibold">{remaining}</span>
          </p>
        )}
      </div>

    </div>
  );
};

export default CategoryCard;
