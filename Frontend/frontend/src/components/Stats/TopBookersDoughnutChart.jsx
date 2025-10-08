import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useTopBookers } from "./useTopBookers";

ChartJS.register(ArcElement, Tooltip, Legend);

function TopBookersDoughnutChart() {
  const { topBookersData, totalPaidBookings, error, isPending } =
    useTopBookers();

  // Generate beautiful gradient colors based on the theme
  const generateColors = (length) => {
    const colors = [];
    const borderColors = [];

    for (let i = 0; i < length; i++) {
      if (i === 0) {
        // Top booker gets the main theme color
        colors.push("#dfa379");
        borderColors.push("#dfa379");
      } else {
        // Other bookers get gradient variations
        const opacity = Math.max(0.2, 1 - i * 0.15);
        colors.push(`rgba(223, 163, 121, ${opacity})`);
        borderColors.push("#dfa379");
      }
    }

    return { colors, borderColors };
  };

  const { colors, borderColors } = generateColors(topBookersData.length);

  const chartData = {
    labels: topBookersData.map((user) => user.name),
    datasets: [
      {
        label: "Bookings",
        data: topBookersData.map((user) => user.totalBookings),
        backgroundColor: colors,
        borderColor: borderColors,
        borderWidth: 3,
        hoverBorderWidth: 4,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    interaction: {
      intersect: false,
    },
    plugins: {
      legend: {
        display: false, // We'll create a custom legend
      },
      title: {
        display: false, // Custom title
      },
      tooltip: {
        backgroundColor: "rgba(31, 41, 55, 0.95)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "#dfa379",
        borderWidth: 1,
        cornerRadius: 12,
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
          title: (context) => {
            return `🏆 ${context[0].label}`;
          },
          label: (context) => {
            const user = topBookersData[context.dataIndex];
            const totalBookings = user.totalBookings.toLocaleString();
            const totalSpent = user.totalSpent.toLocaleString();
            return [
              `📊 Bookings: ${totalBookings}`,
              `💰 Total Spent: $${totalSpent}`,
            ];
          },
        },
      },
    },
    elements: {
      arc: {
        borderRadius: 6,
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
              Top Bookers Distribution
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
            Your most valued customers and their booking patterns
          </p>
        </div>

        {isPending ? (
          <div
            style={{
              height: "400px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                border: "3px solid rgba(223, 163, 121, 0.2)",
                borderTop: "3px solid #dfa379",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
            <p
              style={{
                color: "#6b7280",
                fontSize: "14px",
                fontFamily: "'Inter', sans-serif",
                margin: 0,
              }}
            >
              Loading booker data...
            </p>
          </div>
        ) : error ? (
          <div
            style={{
              height: "400px",
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
              Unable to load booker data
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Chart Section */}
            <div className="lg:col-span-2 relative">
              <div style={{ height: "350px", position: "relative" }}>
                <Doughnut data={chartData} options={options} />

                {/* Center stats */}
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center",
                    pointerEvents: "none",
                  }}
                >
                  <div
                    style={{
                      fontSize: "32px",
                      fontWeight: "700",
                      color: "#1f2937",
                      fontFamily: "'Inter', sans-serif",
                      lineHeight: "1",
                    }}
                  >
                    {totalPaidBookings.toLocaleString()}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#6b7280",
                      fontFamily: "'Inter', sans-serif",
                      marginTop: "4px",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Total Bookings
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Legend Section */}
            <div className="lg:col-span-1">
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#1f2937",
                  fontFamily: "'Inter', sans-serif",
                  marginBottom: "16px",
                }}
              >
                Top Performers
              </h3>
              <div className="space-y-3">
                {topBookersData.slice(0, 5).map((user, index) => {
                  const percentage = (
                    (user.totalBookings / totalPaidBookings) *
                    100
                  ).toFixed(1);
                  return (
                    <div
                      key={user.name}
                      style={{
                        padding: "12px 16px",
                        backgroundColor:
                          index === 0
                            ? "rgba(223, 163, 121, 0.1)"
                            : "rgba(107, 114, 128, 0.05)",
                        borderRadius: "12px",
                        border:
                          index === 0
                            ? "1px solid rgba(223, 163, 121, 0.2)"
                            : "1px solid rgba(107, 114, 128, 0.1)",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "translateY(-1px)";
                        e.target.style.boxShadow =
                          "0 4px 12px rgba(0, 0, 0, 0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "none";
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          style={{
                            width: "12px",
                            height: "12px",
                            backgroundColor: colors[index],
                            borderRadius: "50%",
                            flexShrink: 0,
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p
                              style={{
                                fontSize: "14px",
                                fontWeight: "600",
                                color: "#1f2937",
                                fontFamily: "'Inter', sans-serif",
                                margin: 0,
                                truncate: true,
                              }}
                            >
                              {user.name}
                              {index === 0 && (
                                <span
                                  style={{
                                    fontSize: "12px",
                                    marginLeft: "6px",
                                  }}
                                >
                                  👑
                                </span>
                              )}
                            </p>
                            <span
                              style={{
                                fontSize: "12px",
                                fontWeight: "500",
                                color: "#6b7280",
                                fontFamily: "'Inter', sans-serif",
                              }}
                            >
                              {percentage}%
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <p
                              style={{
                                fontSize: "12px",
                                color: "#6b7280",
                                fontFamily: "'Inter', sans-serif",
                                margin: 0,
                              }}
                            >
                              {user.totalBookings} bookings
                            </p>
                            <p
                              style={{
                                fontSize: "12px",
                                color: "#dfa379",
                                fontWeight: "500",
                                fontFamily: "'Inter', sans-serif",
                                margin: 0,
                              }}
                            >
                              ${user.totalSpent.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

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

      {/* CSS for spinner animation */}
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

export default TopBookersDoughnutChart;
