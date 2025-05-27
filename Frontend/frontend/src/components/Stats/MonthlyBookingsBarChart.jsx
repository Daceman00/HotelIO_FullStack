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
            ? "rgba(223, 163, 121, 0.9)"
            : "rgba(223, 163, 121, 0.6)"
        ),
        borderColor: monthlyBookings?.data.months.map((m) =>
          m.count ===
          Math.max(...monthlyBookings.data.months.map((month) => month.count))
            ? "rgba(223, 163, 121, 1)"
            : "rgba(223, 163, 121, 0.8)"
        ),
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "index",
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.04)",
          drawBorder: false,
        },
        ticks: {
          color: "#6b7280",
          font: {
            size: 12,
            weight: "500",
          },
          padding: 10,
        },
        title: {
          display: true,
          text: "Count",
          color: "#374151",
          font: {
            size: 14,
            weight: "600",
          },
          padding: { bottom: 15 },
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: "#6b7280",
          font: {
            size: 12,
            weight: "500",
          },
          padding: 5,
        },
        title: {
          display: true,
          text: "Month",
          color: "#374151",
          font: {
            size: 14,
            weight: "600",
          },
          padding: { top: 15 },
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
        align: "end",
        labels: {
          color: "#374151",
          font: {
            size: 13,
            weight: "500",
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: "rectRounded",
        },
      },
      title: {
        display: true,
        text: "Monthly Count Distribution",
        color: "#111827",
        font: {
          size: 18,
          weight: "700",
        },
        padding: { bottom: 30 },
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.95)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "rgba(99, 102, 241, 0.3)",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        titleFont: {
          size: 13,
          weight: "600",
        },
        bodyFont: {
          size: 12,
          weight: "500",
        },
        padding: 12,
      },
    },
  };

  return (
    <div className="w-full">
      {/* Header with Year Picker */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Monthly Bookings Overview
          </h2>
          <div className="h-6 w-px bg-gray-300"></div>
          <span className="text-sm text-gray-500 font-medium">
            Tracking performance across months
          </span>
        </div>

        {/* Modern Year Picker */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="group relative inline-flex items-center gap-3 px-5 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 ease-in-out"
            onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
          >
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-gray-400 group-hover:text-amber-500 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="font-semibold text-gray-900">
                {selectedYear}
              </span>
            </div>
            <svg
              className={`w-4 h-4 text-gray-400 group-hover:text-amber-500 transform transition-all duration-200 ${
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
          </button>

          {/* Dropdown Menu */}
          {isYearDropdownOpen && (
            <div className="absolute right-0 z-20 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
              <div className="py-1">
                {years.map((year) => (
                  <button
                    key={year}
                    className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors duration-150 ${
                      year === selectedYear
                        ? "bg-amber-50 text-amber-700 border-r-2 border-amber-500"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    onClick={() => {
                      setSelectedYear(year);
                      setIsYearDropdownOpen(false);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span>{year}</span>
                      {year === selectedYear && (
                        <svg
                          className="w-4 h-4 text-amber-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chart Container */}
      {isPending ? (
        <div className="flex items-center justify-center h-96 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-gray-100">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="relative">
          {/* Chart Background with Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-orange-50 rounded-2xl opacity-60"></div>

          {/* Chart Container */}
          <div
            className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-shadow duration-300"
            style={{
              height: "40vh",
              minHeight: "400px",
              padding: "32px 24px 24px 24px",
              margin: "0",
            }}
          >
            <Bar data={data} options={options} />
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-4 right-4 w-2 h-2 bg-amber-400 rounded-full opacity-60"></div>
          <div className="absolute top-8 right-8 w-1 h-1 bg-orange-400 rounded-full opacity-40"></div>
          <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-amber-500 rounded-full opacity-50"></div>
        </div>
      )}

      {/* Bottom Stats Bar */}
      {monthlyBookings?.data && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-4 text-white">
            <div className="text-sm opacity-90">Total Bookings</div>
            <div className="text-2xl font-bold">
              {monthlyBookings.data.months.reduce(
                (sum, month) => sum + month.count,
                0
              )}
            </div>
          </div>
          <div className="bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl p-4 text-white">
            <div className="text-sm opacity-90">Peak Month</div>
            <div className="text-2xl font-bold">
              {monthlyBookings.data.months.find(
                (m) =>
                  m.count ===
                  Math.max(
                    ...monthlyBookings.data.months.map((month) => month.count)
                  )
              )?.monthName || "N/A"}
            </div>
          </div>
          <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-xl p-4 text-white">
            <div className="text-sm opacity-90">Average</div>
            <div className="text-2xl font-bold">
              {Math.round(
                monthlyBookings.data.months.reduce(
                  (sum, month) => sum + month.count,
                  0
                ) / monthlyBookings.data.months.length
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MonthlyBookingsBarChart;
