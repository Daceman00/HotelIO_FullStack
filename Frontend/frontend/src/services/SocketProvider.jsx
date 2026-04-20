// components/SocketProvider.jsx
import { useEffect } from "react";
import { io } from "socket.io-client";
import useSocketStore from "../stores/useSocketStore";
import useAuthStore from "../stores/AuthStore";
import useNotificationStore from "../stores/NotificationStore";

let socket = null;

const getUserIdFromToken = (token) => {
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload?.id || payload?.userId || payload?.sub || null;
  } catch (error) {
    return null;
  }
};

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
  const effectiveUserId = userId || getUserIdFromToken(token);

  // Set current user in notification store when component mounts
  useEffect(() => {
    if (effectiveUserId) {
      setCurrentUser(effectiveUserId);
    }

    return () => {
      // Clear on unmount (logout)
      if (!isUserLoggedIn) {
        clearCurrentUser();
      }
    };
  }, [effectiveUserId, isUserLoggedIn, setCurrentUser, clearCurrentUser]);

  useEffect(() => {
    // Only connect if user is logged in
    if (!isUserLoggedIn || !token) {
      return;
    }

    const VITE_API_URL = "http://localhost:3000";
    //const VITE_API_URL = 'https://hotelio-fullstack.onrender.com'

    // Connect to Socket.IO server
    socket = io(VITE_API_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    // Connection events
    socket.on("connect", () => {
      setIsConnected(true);

      // Request online users list when connected
      if (isAdmin) {
        socket.emit("admin:request_online_users");
        socket.emit("admin:request_last_seen");
      }
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error.message);
      setIsConnected(false);
    });

    // 🔔 NEW: Listen for notifications (ALL USERS)
    socket.on("notification:new", (notification) => {
      // Add to notification store (shows in bell dropdown)
      addNotification(notification, effectiveUserId);
    });

    // Admin events
    socket.on("admin:connected", () => {});

    // Initial online users list
    socket.on("users:online_list", (usersList) => {
      const onlineUserIds = usersList.map((user) => user.userId);
      setOnlineUsers(onlineUserIds);
    });

    // Last seen list
    socket.on("users:last_seen_list", (lastSeenList) => {
      setLastSeenList(lastSeenList);
    });

    // User status changes (online/offline)
    socket.on("user:status_change", (data) => {
      if (data.status === "online") {
        addOnlineUser(data.userId);
      } else {
        removeOnlineUser(data.userId);
      }

      // Store last seen timestamp when user goes offline
      if (data.lastSeen) {
        setUserLastSeen(data.userId, data.lastSeen);
      }
    });

    // User activity events (signup/login notifications)
    socket.on("user:activity", (data) => {
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
    });

    // Cleanup on unmount or when dependencies change
    return () => {
      if (socket) {
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
    addNotification,
    userId,
    effectiveUserId,
  ]);

  return children;
};

export const getSocket = () => socket;
