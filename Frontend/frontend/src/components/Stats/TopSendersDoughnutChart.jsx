import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useGetTopSpenders } from "./useTopSenders";
import Loading from "../Reusable/Loading";
import { modes } from "../../hooks/useServiceConfig";

ChartJS.register(ArcElement, Tooltip, Legend);

function TopSendersDoguhnutChart() {
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
          index === 0 ? "rgba(223, 163, 121, 1)" : "rgba(54, 162, 235, 0.8)"
        ),
        borderColor: topSpendersData.map((user, index) =>
          index === 0 ? "rgba(223, 163, 121, 2)" : "rgba(54, 162, 235, 1)"
        ),
        borderWidth: 1,
      },
    ],
  };

  // Chart options
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
        text: "Top Spenders Distribution",
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
    return <Loading mode={modes.all} />;
  }

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
      <h3
        style={{
          marginBottom: "1rem",
          color: "#333",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Top Spenders Distribution
      </h3>
      <Doughnut className="p-1" data={chartData} options={options} />
    </div>
  );
}

export default TopSendersDoguhnutChart;
