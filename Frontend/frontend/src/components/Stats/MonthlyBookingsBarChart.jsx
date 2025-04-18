import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useGetMonthlyBookings } from "./useMonthlyBookings";
import Loading from "../Reusable/Loading";
import { modes } from "../../hooks/useServiceConfig";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function MonthlyBookingsBarChart() {
  const [selectedYear, setSelectedYear] = useState("2025");
  const { monthlyBookings, error, isPending } =
    useGetMonthlyBookings(selectedYear);

  const data = {
    labels: monthlyBookings?.data.months.map((m) => m.monthName),
    datasets: [
      {
        label: `Monthly Counts (${monthlyBookings?.data.year})`,
        data: monthlyBookings?.data.months.map((m) => m.count),
        backgroundColor: "rgba(54, 162, 235, 0.8)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Count",
        },
      },
      x: {
        title: {
          display: true,
          text: "Month",
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Count Distribution",
      },
    },
  };

  if (isPending) {
    return <Loading mode={modes.all} />;
  }

  return (
    <div>
      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
        style={{ margin: "10px", padding: "5px" }}
      >
        {[2020, 2021, 2022, 2023, 2024, 2025].map((year) => (
          <option key={year} value={year.toString()}>
            {year}
          </option>
        ))}
      </select>
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
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}

export default MonthlyBookingsBarChart;
