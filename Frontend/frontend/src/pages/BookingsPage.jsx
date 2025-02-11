import Bookings from "../components/Bookings/Bookings";
import Loading from "../components/Reusable/Loading";
import { modes } from "../hooks/useServiceConfig";

function BookingsPage() {
  return (
    <>
      <Loading mode={modes.all} />
      <Bookings />
    </>
  );
}

export default BookingsPage;
