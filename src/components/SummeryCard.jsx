import React from 'react'

const SummeryCard = ({title, amount, icon}) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-5 flex items-center gap-4       hover:shadow-lg transition-all duration-300">
      <div className="text-4xl text-[#fcba03]">
        {icon}
      </div>

      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h2 className="text-2xl font-bold text-gray-900">₹{amount}</h2>
      </div>
    </div>
  )
}

export default SummeryCard
