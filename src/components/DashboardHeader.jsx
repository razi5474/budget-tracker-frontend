import React from "react";

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const DashboardHeader = ({ selectedMonth, selectedYear, setSelectedMonth, setSelectedYear }) => {

  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value);

    setSelectedMonth(newMonth + 1); // +1 because months array is 0-indexed
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  return (
    <div className="
      flex flex-col gap-4 
      md:flex-row md:items-center md:justify-between 
      mb-6
    ">
      <h1 className="text-2xl font-bold text-gray-800 text-center md:text-left">
        {months[selectedMonth - 1]} {selectedYear}
      </h1>

      <div className="flex gap-3 justify-center md:justify-end">
        <select
          className="border rounded-md px-3 py-2 text-gray-700 bg-white shadow-sm"
          value={selectedMonth - 1}
          onChange={handleMonthChange}
        >
          {months.map((m, i) => (
            <option key={i} value={i}>{m}</option>
          ))}
        </select>

        <input
          type="number"
          value={selectedYear}
          onChange={handleYearChange}
          className="w-24 border rounded-md px-3 py-2 text-gray-700 shadow-sm"
        />
      </div>
    </div>
  );
};

export default DashboardHeader;
