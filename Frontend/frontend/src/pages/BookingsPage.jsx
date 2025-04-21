import Bookings from "../components/Bookings/AdminBookings/Bookings";
import UserBookings from "../components/Bookings/UserBookings";
import useAuthStore from "../stores/AuthStore";

function BookingsPage() {
  const { isAdmin } = useAuthStore();
  return isAdmin ? <Bookings /> : <UserBookings />;
}

export default BookingsPage;
