import React from "react";
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
import { useTopRooms } from "./useTopRooms";
import LoadingSpinner from "../Reusable/LoadingSpinner";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function TopRoomsBarChart() {
  const { rooms, error, isPending } = useTopRooms("roomNumber");

  const bookingCounts =
    rooms?.data.data.map((room) => room.bookingsCount) || [];
  const maxBookings = Math.max(...bookingCounts);

  const chartData = {
    labels: rooms?.data.data.map((room) => `Room ${room.roomNumber}`),
    datasets: [
      {
        label: "Number of Bookings",
        data: bookingCounts,
        roomTypes: rooms?.data.data.map((room) => room.roomType),
        backgroundColor: bookingCounts.map((count) =>
          count === maxBookings ? "#dfa379" : "rgba(223, 163, 121, 0.3)"
        ),
        borderColor: bookingCounts.map((count) =>
          count === maxBookings ? "#dfa379" : "#dfa379"
        ),
        borderWidth: 2,
        borderRadius: {
          topLeft: 6,
          topRight: 6,
        },
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
    plugins: {
      legend: {
        display: false, // Hide legend for cleaner look
      },
      title: {
        display: false, // We'll use custom title
      },
      tooltip: {
        backgroundColor: "rgba(31, 41, 55, 0.95)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "#dfa379",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 16,
        titleFont: {
          size: 14,
          weight: "600",
          family: "'Inter', sans-serif",
        },
        bodyFont: {
          size: 13,
          family: "'Inter', sans-serif",
        },
        callbacks: {
          title: (tooltipItems) => {
            return tooltipItems[0].label;
          },
          label: (context) => {
            const roomType = context.dataset.roomTypes[context.dataIndex];
            return [
              `📊 Bookings: ${context.parsed.y}`,
              `🏠 Room Type: ${roomType}`,
            ];
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            family: "'Inter', sans-serif",
            weight: "500",
          },
          color: "#6b7280",
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(107, 114, 128, 0.1)",
          drawBorder: false,
        },
        border: {
          display: false,
        },
        ticks: {
          stepSize: 1,
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          color: "#6b7280",
        },
      },
    },
  };

  return (
    <div className="relative">
      {/* Glass-morphism background container */}
      <div
        style={{
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(223, 163, 121, 0.2)",
          borderRadius: "20px",
          padding: "32px",
          margin: "24px 0",
          boxShadow: `
            0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative gradient overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background:
              "linear-gradient(90deg, #dfa379 0%, rgba(223, 163, 121, 0.3) 50%, #dfa379 100%)",
            borderRadius: "20px 20px 0 0",
          }}
        />

        {/* Modern header section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div
              style={{
                width: "8px",
                height: "32px",
                background:
                  "linear-gradient(135deg, #dfa379 0%, rgba(223, 163, 121, 0.6) 100%)",
                borderRadius: "4px",
              }}
            />
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#1f2937",
                margin: 0,
                fontFamily:
                  "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                letterSpacing: "-0.025em",
              }}
            >
              Most Booked Rooms
            </h2>
          </div>
          <p
            style={{
              fontSize: "14px",
              color: "#6b7280",
              margin: 0,
              fontFamily: "'Inter', sans-serif",
              paddingLeft: "32px",
            }}
          >
            Track your highest performing accommodations
          </p>

          {/* Stats summary */}
          {!isPending && rooms?.data.data && (
            <div className="flex gap-6 mt-4 pl-8">
              <div className="flex items-center gap-2">
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    backgroundColor: "#dfa379",
                    borderRadius: "50%",
                  }}
                />
                <span
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  Top Performer
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    backgroundColor: "rgba(223, 163, 121, 0.3)",
                    borderRadius: "50%",
                  }}
                />
                <span
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  Other Rooms
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Chart container */}
        <div
          style={{
            height: "400px",
            position: "relative",
          }}
        >
          {isPending ? (
            <div
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <LoadingSpinner />
              <p
                style={{
                  color: "#6b7280",
                  fontSize: "14px",
                  fontFamily: "'Inter', sans-serif",
                  margin: 0,
                }}
              >
                Loading room data...
              </p>
            </div>
          ) : error ? (
            <div
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: "20px" }}>⚠️</span>
              </div>
              <p
                style={{
                  color: "#ef4444",
                  fontSize: "14px",
                  fontFamily: "'Inter', sans-serif",
                  margin: 0,
                  textAlign: "center",
                }}
              >
                Unable to load room data
              </p>
            </div>
          ) : (
            <Bar data={chartData} options={options} />
          )}
        </div>

        {/* Bottom gradient line */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "1px",
            background:
              "linear-gradient(90deg, transparent 0%, #dfa379 50%, transparent 100%)",
          }}
        />
      </div>
    </div>
  );
}

export default TopRoomsBarChart;
