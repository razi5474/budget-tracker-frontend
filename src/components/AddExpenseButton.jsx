import React from "react";
import { FiPlus } from "react-icons/fi";

const AddExpenseButton = ({ onOpen }) => {
  return (
    <button
      onClick={onOpen}
      className="
        fixed bottom-6 right-6 
        bg-[--color-primary] text-black
        p-4 rounded-full shadow-lg
        hover:bg-[#e0a802] transition-all
      "
    >
      <FiPlus size={24} />
    </button>
  );
};

export default AddExpenseButton;
