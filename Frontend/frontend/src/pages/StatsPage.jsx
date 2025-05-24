import React from "react";
import CustomerStatsCard from "../components/Stats/CustomerStatsCard";
import { useUsers } from "../components/Auth/AdminAuth/useUsers";
import BookingsStatsCard from "../components/Stats/BookingsStatsCard";
import { useGetBookingsCount } from "../components/Bookings/AdminBookings/useGetBookingsCount";
import TopSendersDoguhnutChart from "../components/Stats/TopSendersDoughnutChart";
import TopBookersDoguhnutChart from "../components/Stats/topBookersDoughnutChart";
import TotalSpentStatsCard from "../components/Stats/TotalSpentStatsCard";
import { usetotalRevenue } from "../components/Stats/useTotalRevenue";
import { useTopReviewers } from "../components/Stats/useTopReviewers";
import TopReviewersStatsCard from "../components/Stats/TopReviewersStatsCard";
import MonthlyBookingsBarChart from "../components/Stats/MonthlyBookingsBarChart";
import TopRoomsBarChart from "../components/Stats/TopRoomsBarChart";
import LoadingSpinner from "../components/Reusable/LoadingSpinner";
import LatestBookings from "../components/Stats/LatestBookings";

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 sm:p-6 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {usersIsPending ||
      isPending_count ||
      isPendingRevenue ||
      isPendingReviewers ? (
        <div className="col-span-full min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <CustomerStatsCard users={totalUsers} />
          <BookingsStatsCard bookings={bookings_counts} />
          <TotalSpentStatsCard totalRevenue={totalRevenue} />
          <TopReviewersStatsCard reviewers={topReviewers} />

          <div className="col-span-full">
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
              <div className="w-full ">
                <LatestBookings />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default StatsPage;
