import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Dashboard from "../components/Dashboard/Dashboard";
import Reviews from "../components/Reviews/Reviews";
import Rooms from "../components/Rooms/Rooms";

function DashboardPage() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#reviews") {
      const section = document.getElementById("reviews");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <>
      <Dashboard />
      <Rooms />
      <Reviews />
    </>
  );
}

export default DashboardPage;
