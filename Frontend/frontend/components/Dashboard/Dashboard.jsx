import React from "react";
import Button from "../Reusable/Button";

function Dashboard() {
  return (
    <div className=" flex-1 p-6  ">
      <h1 className=" text-3xl font-bold mb-4">Dashboard Overview</h1>
      <div className="animate-fadeInDown grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 ">
        <div className="  p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl">
          <h3>Total Rooms</h3>
          <p className="text-xl">50</p>
        </div>
        <div className=" p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl">
          <h3>Total Reservations</h3>
          <p className="text-xl">120</p>
        </div>
        <div className="  p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl">
          <h3>Total Revenue</h3>
          <p className="text-xl">$12,000</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
