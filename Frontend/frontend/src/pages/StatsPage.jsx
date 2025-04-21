import React from "react";
import CustomerStatsCard from "../components/Stats/CustomerStatsCard";
import { useUsers } from "../components/Auth/AdminAuth/useUsers";
import { modes } from "../hooks/useServiceConfig";
import Loading from "../components/Reusable/Loading";
import BookingsStatsCard from "../components/Stats/BookingsStatsCard";
import { useGetAllBookings } from "../components/Bookings/AdminBookings/useGetAllBookings";
import { useGetBookingsCount } from "../components/Bookings/AdminBookings/useGetBookingsCount";
import TopSendersDoguhnutChart from "../components/Stats/TopSendersDoughnutChart";
import TopBookersDoguhnutChart from "../components/Stats/topBookersDoughnutChart";
import TotalSpentStatsCard from "../components/Stats/TotalSpentStatsCard";
import { usetotalRevenue } from "../components/Stats/useTotalRevenue";
import { useTopReviewers } from "../components/Stats/useTopReviewers";
import TopReviewersStatsCard from "../components/Stats/TopReviewersStatsCard";
import MonthlyBookingsBarChart from "../components/Stats/MonthlyBookingsBarChart";
import { useGetMonthlyBookings } from "../components/Stats/useMonthlyBookings";
import TopRoomsBarChart from "../components/Stats/TopRoomsBarChart";

function StatsPage() {
  const {
    total: totalUsers,
    error: usersError,
    isPending: usersIsPending,
  } = useUsers();
  const { bookings_counts, error_count, isPending_count } =
    useGetBookingsCount();
  const {
    totalRevenue,
    isPending: isPendingRevenue,
    error,
  } = usetotalRevenue();

  const {
    topReviewers,
    isPending: isPendingReviewers,
    error: reviewersError,
  } = useTopReviewers();

  /*  if (
    usersIsPending ||
    isPending_count ||
    isPendingRevenue ||
    isPendingReviewers
  ) {
    return <Loading mode={modes.all} />;
  } */

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 sm:p-6">
        <CustomerStatsCard users={totalUsers} />
        <BookingsStatsCard bookings={bookings_counts} />
        <TotalSpentStatsCard totalRevenue={totalRevenue} />
        <TopReviewersStatsCard reviewers={topReviewers} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="w-full">
          <TopSendersDoguhnutChart />
        </div>
        <div className="w-full">
          <TopBookersDoguhnutChart />
        </div>
        <div className="w-full">
          <MonthlyBookingsBarChart />
        </div>
        <div className="w-full">
          <TopRoomsBarChart />
        </div>
      </div>
    </>
  );
}

export default StatsPage;
