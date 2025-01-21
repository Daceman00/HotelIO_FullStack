import Dashboard from "../components/Dashboard/Dashboard";
import Loading from "../components/Reusable/Loading";
import Reviews from "../components/Reviews/Reviews";
import Rooms from "../components/Rooms/Rooms";
import { modes } from "../hooks/useServiceConfig";

function DashboardPage() {
  return (
    <>
      <Loading mode={modes.all} />
      <Dashboard />
      <Rooms />
      <Reviews />
    </>
  );
}

export default DashboardPage;
