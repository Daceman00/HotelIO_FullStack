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

  if (
    usersIsPending ||
    isPending_count ||
    isPendingRevenue ||
    isPendingReviewers
  ) {
    return <Loading mode={modes.all} />;
  }

  return (
    <div className="flex flex-wrap gap-4 p-4">
      <div className="w-full md:w-[20%]">
        <CustomerStatsCard users={totalUsers} />
      </div>
      <div className="w-full md:w-[20%]">
        <BookingsStatsCard bookings={bookings_counts} />
      </div>
      <div className="w-full md:w-[20%]">
        <TotalSpentStatsCard totalRevenue={totalRevenue} />
      </div>
      <div className="w-full md:w-[20%]">
        <TopReviewersStatsCard reviewers={topReviewers} />
      </div>
      <div className="w-full md:w-[49%]">
        <TopSendersDoguhnutChart />
      </div>
      <div className="w-full md:w-[49%]">
        <TopBookersDoguhnutChart />
      </div>
    </div>
  );
}

export default StatsPage;
