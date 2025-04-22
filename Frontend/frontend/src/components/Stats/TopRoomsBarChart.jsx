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
    labels: rooms?.data.data.map((room) => `${room.roomNumber}`),
    datasets: [
      {
        label: "Number of Bookings Per Room",
        data: bookingCounts,
        roomTypes: rooms?.data.data.map((room) => room.roomType), // Add this line
        backgroundColor: bookingCounts.map((count) =>
          count === maxBookings
            ? "rgba(223, 163, 121, 1)"
            : "rgba(54, 162, 235, 0.8)"
        ),
        borderColor: bookingCounts.map((count) =>
          count === maxBookings
            ? "rgba(223, 163, 121, 1)"
            : "rgba(54, 162, 235, 0.8)"
        ),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Most Booked Rooms",
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          title: (tooltipItems) => {
            return tooltipItems[0].label;
          },
          label: (context) => {
            const roomType = context.dataset.roomTypes[context.dataIndex];
            return [`Bookings: ${context.parsed.y}`, `Room Type: ${roomType}`];
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
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
      {isPending ? (
        <div className="h-full flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </div>
  );
}

export default TopRoomsBarChart;
