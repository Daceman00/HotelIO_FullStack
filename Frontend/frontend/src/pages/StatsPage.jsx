import React from "react";
import TopSendersPieChart from "../components/Stats/TopSendersPieChart";
import CustomerStatsCard from "../components/Stats/CustomerStatsCard";
import { useUsers } from "../components/Auth/AdminAuth/useUsers";
import { modes } from "../hooks/useServiceConfig";
import Loading from "../components/Reusable/Loading";
import BookingsStatsCard from "../components/Stats/BookingsStatsCard";
import { useGetAllBookings } from "../components/Bookings/AdminBookings/useGetAllBookings";
import { useGetBookingsCount } from "../components/Bookings/AdminBookings/useGetBookingsCount";

function StatsPage() {
  const {
    total: totalUsers,
    error: usersError,
    isPending: usersIsPending,
  } = useUsers();
  const { bookings_counts, error_count, isPending_count } =
    useGetBookingsCount();

  if (usersIsPending || isPending_count) {
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
      <div className="w-full">
        <TopSendersPieChart />
      </div>
    </div>
  );
}

export default StatsPage;
