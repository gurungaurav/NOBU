import React from "react";

export default function VendorDashCards({ title, data, icon }) {
  return (
    <div className="rounded-lg border shadow-sm p-4 py-6 bg-white flex flex-col  justify-center">
      <p>
        {icon}
        {title}
      </p>
      <p className="font-semibold text-gray-400 text-sm">{data}</p>
    </div>
  );
}
