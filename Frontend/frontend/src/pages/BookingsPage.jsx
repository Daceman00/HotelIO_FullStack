import Bookings from "../components/Bookings/AdminBookings/Bookings";
import UserBookings from "../components/Bookings/UserBookings";
import Loading from "../components/Reusable/Loading";
import { modes } from "../hooks/useServiceConfig";
import useAuthStore from "../stores/AuthStore";

function BookingsPage() {
  const { isAdmin } = useAuthStore();
  return (
    <>
      <Loading mode={modes.all} />
      {isAdmin ? <Bookings /> : <UserBookings />}
    </>
  );
}

export default BookingsPage;
