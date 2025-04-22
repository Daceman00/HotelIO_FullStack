import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useTopBookers } from "./useTopBookers";

ChartJS.register(ArcElement, Tooltip, Legend);

function TopBookersDoughnutChart() {
  const { topBookers, error, isPending } = useTopBookers();

  const topBookersData = topBookers?.data?.topBookers || [];

  const chartData = {
    labels: topBookersData.map((user) => user.name),
    datasets: [
      {
        label: "Number of Bookings",
        data: topBookersData.map((user) => user.totalBookings),
        backgroundColor: topBookersData.map((user, index) =>
          index === 0 ? "rgba(223, 163, 121, 1)" : "rgba(54, 162, 235, 0.8)"
        ),
        borderColor: topBookersData.map((user, index) =>
          index === 0 ? "rgba(223, 163, 121, 2)" : "rgba(54, 162, 235, 1)"
        ),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "50%",
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Top Bookers Distribution",
        color: "#333",
        font: {
          size: 18,
          weight: "bold",
          family: "Arial",
        },
        padding: {
          top: 10,
          bottom: 20,
        },
        fullSize: true,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const user = topBookersData[context.dataIndex];
            const totalBookings = user.totalBookings.toLocaleString();
            const totalSpent = user.totalSpent.toLocaleString();
            return [
              `Name: ${user.name}`,
              `Total Bookings: ${totalBookings}`,
              `Total Spent: $${totalSpent}`,
            ];
          },
        },
      },
    },
  };

  return (
    <div
      style={{
        height: "40vh",
        minHeight: "300px",
        padding: "20px 20px 40px 20px",
        margin: "20px 0",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow:
          "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)",
      }}
    >
      <Doughnut className="p-1" data={chartData} options={options} />
    </div>
  );
}

export default TopBookersDoughnutChart;
