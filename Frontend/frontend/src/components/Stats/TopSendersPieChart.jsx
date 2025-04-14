import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { useGetTopSpenders } from "./useTopSenders";
import Loading from "../Reusable/Loading";
import { modes } from "../../hooks/useServiceConfig";

ChartJS.register(ArcElement, Tooltip, Legend);

function TopSendersPieChart() {
  const { topSpenders, error, isPending } = useGetTopSpenders();

  const topSpendersData = topSpenders?.data?.topSpenders || [];

  // Chart data configuration
  const chartData = {
    labels: topSpendersData.map((user) => user.name),
    datasets: [
      {
        label: "Total Spent",
        data: topSpendersData.map((user) => user.totalSpent),
        backgroundColor: topSpendersData.map((user, index) =>
          index === 0 ? "rgba(255, 99, 132, 0.8)" : "rgba(54, 162, 235, 0.8)"
        ),
        borderColor: topSpendersData.map((user, index) =>
          index === 0 ? "rgba(255, 99, 132, 1)" : "rgba(54, 162, 235, 1)"
        ),
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Top Spenders Distribution",
        font: {
          size: 18,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const user = topSpendersData[context.dataIndex];
            const total = user.totalSpent.toLocaleString();
            const avg = user.averageSpent.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            });
            return [
              `Name: ${user.name}`,
              `Total: $${total}`,
              `Average: $${avg}`,
              `Bookings: ${user.totalBookings}`,
            ];
          },
        },
      },
    },
  };

  if (isPending) {
    return <Loading mode={modes.all} />; // Fixed: Added return statement
  }

  return (
    <div style={{ height: "500px", maxWidth: "800px", margin: "0 auto" }}>
      <Pie data={chartData} options={options} />
    </div>
  );
}

export default TopSendersPieChart;
