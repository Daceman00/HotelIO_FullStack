import React, { useState, useEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";
import LoadingSpinner from "../Reusable/LoadingSpinner";
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
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { monthlyBookings, error, isPending } =
    useGetMonthlyBookings(selectedYear);

  const years = ["2023", "2024", "2025", "2026", "2027"];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsYearDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const data = {
    labels: monthlyBookings?.data.months.map((m) => m.monthName),
    datasets: [
      {
        label: `Monthly Counts (${monthlyBookings?.data.year})`,
        data: monthlyBookings?.data.months.map((m) => m.count),
        backgroundColor: monthlyBookings?.data.months.map((m) =>
          m.count ===
          Math.max(...monthlyBookings.data.months.map((month) => month.count))
            ? "rgba(223, 163, 121, 1)"
            : "rgba(54, 162, 235, 0.8)"
        ),
        borderColor: monthlyBookings?.data.months.map((m) =>
          m.count ===
          Math.max(...monthlyBookings.data.months.map((month) => month.count))
            ? "rgba(223, 163, 121, 1)"
            : "rgba(54, 162, 235, 0.8)"
        ),
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

  return (
    <div>
      <div className="space-y-2">
        <div className="relative w-32" ref={dropdownRef}>
          <div
            className="px-4 py-3 border border-gray-200 rounded-lg cursor-pointer hover:border-[#dfa974] transition-colors flex items-center justify-between"
            onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
          >
            <span>{selectedYear}</span>
            <svg
              className={`w-5 h-5 text-gray-400 transform transition-transform ${
                isYearDropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          {isYearDropdownOpen && (
            <div className="absolute z-10 w-32 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
              {years.map((year) => (
                <div
                  key={year}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setSelectedYear(year);
                    setIsYearDropdownOpen(false);
                  }}
                >
                  {year}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {isPending ? (
        <LoadingSpinner />
      ) : (
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
      )}
    </div>
  );
}

export default MonthlyBookingsBarChart;
