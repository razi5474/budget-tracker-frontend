import React, { useState } from "react";
import { FiHome, FiPieChart, FiSettings, FiMenu, FiLogOut } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { GiCash } from "react-icons/gi";
import toast from "react-hot-toast";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // remove token
    toast.success("Logged out successfully");
    navigate("/"); // redirect to login page
  };

  return (
    <div>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-black text-amber-400 p-2 rounded-md shadow-md"
        onClick={() => setOpen(!open)}
      >
        <FiMenu size={22} />
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white shadow-xl border-r 
          transform transition-transform duration-300 
          lg:translate-x-0 
          ${open ? "translate-x-0" : "-translate-x-full"} 
        `}
      >
        <div className="px-5 py-6 border-b flex items-center gap-2">
          <div className="bg-primary text-white p-2 rounded-md">
            <GiCash size={25} />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Budget Tracker</h2>
        </div>

        {/* Menu Items */}
        <nav className="mt-6 px-4 space-y-2">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-md text-gray-800 font-medium transition-all hover:bg-primary hover:text-white"
          >
            <FiHome size={20} />
            Dashboard
          </Link>

          <Link
            to="/reports"
            className="flex items-center gap-3 px-4 py-3 rounded-md text-gray-800 font-medium transition-all hover:bg-primary hover:text-white"
          >
            <FiPieChart size={20} />
            Reports
          </Link>

          <Link
            to="/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-md text-gray-800 font-medium transition-all hover:bg-primary hover:text-white"
          >
            <FiSettings size={20} />
            Settings
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-gray-800 font-medium transition-all hover:bg-red-500 hover:text-white"
          >
            <FiLogOut size={20} />
            Logout
          </button>
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;
