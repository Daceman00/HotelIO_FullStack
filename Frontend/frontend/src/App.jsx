import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { memo } from "react";
import FooterComponent from "./components/Reusable/Footer";
import HeaderComponent from "./components/Reusable/Header";
import SidebarComponent from "./components/Reusable/Sidebar";
import Error from "./components/Reusable/Error";
import DashboardPage from "./pages/DashboardPage";
import RoomsPage from "./pages/RoomsPage";
import RoomDetails from "./components/Rooms/RoomDetails";
import BookingsPage from "./pages/BookingsPage";
import Signup from "./components/Auth/Signup";
import Payments from "./components/Payments/Payments";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Login from "./components/Auth/Login";
import ProtectedRoute from "./components/Reusable/ProtectedRoute";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";
import UpdateAccount from "./components/Auth/UpdateAccount";
import UpdatePassword from "./components/Auth/UpdatePassword";
import RestrictedRoute from "./components/Reusable/RestrictedRoute";
import Users from "./components/Auth/AdminAuth/Users";
import useAuthStore from "./stores/AuthStore";
import ReviewsForSingleRoom from "./components/Reviews/ReviewsForSingleRoom";
import StatsPage from "./pages/StatsPage";
import About from "./components/Reusable/About";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      //staleTime: 60 * 1000,
      staleTime: 0,
    },
  },
});

const Footer = memo(FooterComponent);
const Header = memo(HeaderComponent);
const Sidebar = memo(SidebarComponent);

function App() {
  const { isUserLoggedIn } = useAuthStore();
  return (
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <ReactQueryDevtools initialIsOpen={false} />
      <BrowserRouter>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex flex-col flex-1 ml-1 overflow-y-auto">
            {isUserLoggedIn && <Header />}
            {/* Render Header if user is logged in */}
            <Routes>
              <Route path="/payments" element={<Payments />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/rooms" element={<RoomsPage />} />
              <Route path="/rooms/:roomId" element={<RoomDetails />} />
              <Route
                path="/rooms/:roomId/reviews"
                element={<ReviewsForSingleRoom />}
              />

              <Route
                path="/bookings"
                element={
                  <ProtectedRoute>
                    <BookingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/updateAccount"
                element={
                  <ProtectedRoute>
                    <UpdateAccount />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/updatePassword"
                element={
                  <ProtectedRoute>
                    <UpdatePassword />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Users />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route
                path="/stats"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <StatsPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/about" element={<About />} />
              <Route path="/forgotPassword" element={<ForgotPassword />} />
              <Route path="/resetPassword/:token" element={<ResetPassword />} />
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
            <Footer />
          </div>
        </div>
      </BrowserRouter>
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: {
            duration: 9000,
          },
          error: {
            duration: 5000,
          },
          style: {
            fontSize: "16px",
            maxWidth: "500px",
            padding: "16px 24px",
            backgroundColor: "#fff",
            color: "#374151",
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
