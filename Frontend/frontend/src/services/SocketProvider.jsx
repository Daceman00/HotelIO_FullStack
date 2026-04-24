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
  } catch {
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

  const isAdmin = useAuthStore((state) => state.isAdmin);
  const isUserLoggedIn = useAuthStore((state) => state.isUserLoggedIn);

  const token = localStorage.getItem("token");
  const effectiveUserId = userId || getUserIdFromToken(token);

  // Keep notification store aware of who the current user is
  useEffect(() => {
    if (effectiveUserId) {
      setCurrentUser(effectiveUserId);
    }
    return () => {
      if (!isUserLoggedIn) {
        clearCurrentUser();
      }
    };
  }, [effectiveUserId, isUserLoggedIn, setCurrentUser, clearCurrentUser]);

  useEffect(() => {
    if (!isUserLoggedIn || !token) return;

    // ✅ Use env variable — never hardcode localhost in production
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    socket = io(API_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    // --- Connection ---
    socket.on("connect", () => {
      setIsConnected(true);
      if (isAdmin) {
        socket.emit("admin:request_online_users");
        socket.emit("admin:request_last_seen");
      }
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      // ✅ Clear online users so the list doesn't stay stale after logout/reconnect
      setOnlineUsers([]);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error.message);
      setIsConnected(false);
    });

    // --- Notifications ---
    // ✅ Dedup guard: prevents duplicates when queued notifications flush on reconnect
    socket.on("notification:new", (notification) => {
      addNotification(notification, effectiveUserId);
    });

    // --- Admin events ---
    socket.on("admin:connected", () => {});

    socket.on("users:online_list", (usersList) => {
      setOnlineUsers(usersList.map((user) => user.userId));
    });

    socket.on("users:last_seen_list", (lastSeenList) => {
      setLastSeenList(lastSeenList);
    });

    socket.on("user:status_change", (data) => {
      if (data.status === "online") {
        addOnlineUser(data.userId);
      } else {
        removeOnlineUser(data.userId);
      }
      if (data.lastSeen) {
        setUserLastSeen(data.userId, data.lastSeen);
      }
    });

    // --- User activity (admin browser notifications) ---
    socket.on("user:activity", (data) => {
      if (Notification.permission === "granted") {
        const icon = data.type === "signup" ? "🆕" : "🔐";
        new Notification(`${icon} ${data.message}`, {
          body: data.user.email,
          icon: "/logo.png",
        });
      }
    });

    // ✅ Fixed: was "UserId" (capital U) and wrong property "usersLastSeen"
    socket.on("user:last_seen", (data) => {
      setUserLastSeen(data.userId, data.lastSeen);
    });

    // --- Cleanup ---
    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
        setIsConnected(false);
        setOnlineUsers([]);
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
