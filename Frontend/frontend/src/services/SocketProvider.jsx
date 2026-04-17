// components/SocketProvider.jsx
import { useEffect } from "react";
import { io } from "socket.io-client";
import useSocketStore from "../stores/useSocketStore";
import useAuthStore from "../stores/AuthStore";
import useNotificationStore from "../stores/NotificationStore";

let socket = null;

export const SocketProvider = ({ children, userId }) => {
  const {
    setIsConnected,
    setOnlineUsers,
    addOnlineUser,
    removeOnlineUser,
    setUserLastSeen,
    setLastSeenList,
  } = useSocketStore();

  const { addNotification, setCurrentUser, clearCurrentUser } =
    useNotificationStore();

  // Get auth state from your existing store
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const isUserLoggedIn = useAuthStore((state) => state.isUserLoggedIn);

  // Get token from localStorage
  const token = localStorage.getItem("token");

  // Set current user in notification store when component mounts
  useEffect(() => {
    if (userId && isUserLoggedIn) {
      console.log("📝 Setting current user in notification store:", userId);
      setCurrentUser(userId);
    }

    return () => {
      // Clear on unmount (logout)
      if (!isUserLoggedIn) {
        clearCurrentUser();
      }
    };
  }, [userId, isUserLoggedIn, setCurrentUser, clearCurrentUser]);

  useEffect(() => {
    // Only connect if user is logged in
    if (!isUserLoggedIn || !token) {
      console.log("Socket not connecting: Not logged in");
      return;
    }

    console.log("🔌 Initializing Socket.IO connection...");

    const VITE_API_URL = "http://localhost:3000";
    //const VITE_API_URL = 'https://hotelio-fullstack.onrender.com'

    // Connect to Socket.IO server
    socket = io(VITE_API_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    // Connection events
    socket.on("connect", () => {
      console.log("✅ Connected to Socket.IO");
      setIsConnected(true);

      // Request online users list when connected
      if (isAdmin) {
        socket.emit("admin:request_online_users");
        socket.emit("admin:request_last_seen");
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from Socket.IO");
      setIsConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error.message);
      setIsConnected(false);
    });

    // 🔔 NEW: Listen for notifications (ALL USERS)
    socket.on("notification:new", (notification) => {
      // Add to notification store (shows in bell dropdown)
      addNotification(notification);
    });

    // Admin events
    socket.on("admin:connected", (data) => {
      console.log("👑 Admin room joined:", data);
    });

    // Initial online users list
    socket.on("users:online_list", (usersList) => {
      console.log("📋 Received online users list:", usersList);
      const onlineUserIds = usersList.map((user) => user.userId);
      setOnlineUsers(onlineUserIds);
    });

    // Last seen list
    socket.on("users:last_seen_list", (lastSeenList) => {
      console.log("⏰ Received last seen list:", lastSeenList);
      setLastSeenList(lastSeenList);
    });

    // User status changes (online/offline)
    socket.on("user:status_change", (data) => {
      console.log(`👤 User ${data.status}:`, data.user.name);

      if (data.status === "online") {
        addOnlineUser(data.userId);
      } else {
        removeOnlineUser(data.userId);
      }

      // Store last seen timestamp when user goes offline
      if (data.lastSeen) {
        console.log(`⏰ User last seen: ${data.user.name} at ${data.lastSeen}`);
        setUserLastSeen(data.userId, data.lastSeen);
      }
    });

    // User activity events (signup/login notifications)
    socket.on("user:activity", (data) => {
      console.log("📡 User activity:", data);

      // Optional: Show browser notification
      if (Notification.permission === "granted") {
        const icon = data.type === "signup" ? "🆕" : "🔐";
        new Notification(`${icon} ${data.message}`, {
          body: data.user.email,
          icon: "/logo.png",
        });
      }
    });

    socket.on("user:last_seen", (data) => {
      setUserLastSeen(data.UserId, data.usersLastSeen);
      console.log(data.userId);
      console.log(data.timestamp);
    });

    // Cleanup on unmount or when dependencies change
    return () => {
      if (socket) {
        console.log("🔌 Disconnecting Socket.IO...");
        socket.disconnect();
        socket = null;
        setIsConnected(false);
      }
    };
  }, [
    isAdmin,
    isUserLoggedIn,
    token,
    setIsConnected,
    setOnlineUsers,
    addOnlineUser,
    removeOnlineUser,
    setUserLastSeen,
    setLastSeenList,
  ]);

  return children;
};

export const getSocket = () => socket;
