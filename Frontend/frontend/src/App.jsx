import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Reusable/Footer";
import Header from "./components/Reusable/Header";
import Sidebar from "./components/Reusable/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import RoomsPage from "./pages/RoomsPage";
import RoomDetails from "./components/Rooms/RoomDetails";
import BookingsPage from "./pages/BookingsPage";
import Signup from "./components/Auth/Signup";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Login from "./components/Auth/Login";
import ProtectedRoute from "./components/Reusable/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      //staleTime: 60 * 1000,
      staleTime: 0,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <ReactQueryDevtools initialIsOpen={false} />
      <BrowserRouter>
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex flex-col flex-1 ml-1 overflow-y-auto">
            <Header />
            <Routes>
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/rooms" element={<RoomsPage />} />
              <Route path="/rooms/:id" element={<RoomDetails />} />
              <Route path="/bookings" element={<BookingsPage />} />
              {/*
            <Route path="/reports" element={<div>Reports Page</div>} />
            <Route path="/settings" element={<div>Settings Page</div>} /> */}
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
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
            duration: 3000,
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
