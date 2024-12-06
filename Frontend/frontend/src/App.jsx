import { BrowserRouter, Route, Routes } from "react-router-dom";
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
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex flex-col flex-1 ml-1 overflow-y-auto">
            <Header />
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/rooms" element={<RoomsPage />} />
              <Route path="/rooms/:id" element={<RoomDetails />} />
              <Route path="/bookings" element={<BookingsPage />} />
              {/*
            <Route path="/reports" element={<div>Reports Page</div>} />
            <Route path="/settings" element={<div>Settings Page</div>} /> */}
              <Route path="/signup" element={<Signup />} />
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
