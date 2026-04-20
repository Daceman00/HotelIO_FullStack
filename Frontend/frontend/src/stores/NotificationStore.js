import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_NOTIFICATIONS_PER_USER = 50;

const ensureArray = (value) => (Array.isArray(value) ? value : []);

const getUserNotifications = (state, userId) => {
  if (!userId) return [];
  return ensureArray(state.notificationsByUser[userId]);
};

const getUnreadCountFromList = (notifications) =>
  notifications.filter((notification) => !notification.read).length;

const toUserIdKey = (userId) => String(userId);
const resolveTargetUserId = (state, explicitUserId) =>
  explicitUserId ? toUserIdKey(explicitUserId) : state.currentUserId;

const useNotificationStore = create(
  persist(
    (set, get) => ({
      notificationsByUser: {},
      notifications: [],
      unreadCount: 0,
      currentUserId: null,

      setCurrentUser: (userId) => {
        const userIdKey = userId ? toUserIdKey(userId) : null;
        set((state) => {
          const currentUserNotifications = getUserNotifications(state, userIdKey);
          return {
            currentUserId: userIdKey,
            notifications: currentUserNotifications,
            unreadCount: getUnreadCountFromList(currentUserNotifications),
          };
        });
      },

      clearCurrentUser: () => {
        set({
          currentUserId: null,
          notifications: [],
          unreadCount: 0,
        });
      },

      getCurrentUserNotifications: () => {
        const state = get();
        return getUserNotifications(state, state.currentUserId);
      },

      getUnreadCount: () => {
        const state = get();
        return state.unreadCount;
      },

      addNotification: (notification, explicitUserId) => {
        set((state) => {
          const targetUserId = resolveTargetUserId(state, explicitUserId);

          if (!targetUserId) {
            return state;
          }

          const currentUserNotifications = getUserNotifications(state, targetUserId);
          const exists = currentUserNotifications.some((item) => item.id === notification.id);

          if (exists) return state;

          const updatedUserNotifications = [notification, ...currentUserNotifications].slice(
            0,
            MAX_NOTIFICATIONS_PER_USER,
          );

          return {
            notificationsByUser: {
              ...state.notificationsByUser,
              [targetUserId]: updatedUserNotifications,
            },
            notifications:
              state.currentUserId === targetUserId
                ? updatedUserNotifications
                : state.notifications,
            unreadCount:
              state.currentUserId === targetUserId
                ? getUnreadCountFromList(updatedUserNotifications)
                : state.unreadCount,
          };
        });
      },

      markAsRead: (notificationId) => {
        set((state) => {
          if (!state.currentUserId) return state;

          const userId = state.currentUserId;
          const currentUserNotifications = getUserNotifications(state, userId);
          const updatedUserNotifications = currentUserNotifications.map((notification) =>
            notification.id === notificationId
              ? { ...notification, read: true }
              : notification,
          );

          return {
            notificationsByUser: {
              ...state.notificationsByUser,
              [userId]: updatedUserNotifications,
            },
            notifications: updatedUserNotifications,
            unreadCount: getUnreadCountFromList(updatedUserNotifications),
          };
        });
      },

      markAllAsRead: () => {
        set((state) => {
          if (!state.currentUserId) return state;

          const userId = state.currentUserId;
          const currentUserNotifications = getUserNotifications(state, userId);
          const updatedUserNotifications = currentUserNotifications.map((notification) => ({
            ...notification,
            read: true,
          }));

          return {
            notificationsByUser: {
              ...state.notificationsByUser,
              [userId]: updatedUserNotifications,
            },
            notifications: updatedUserNotifications,
            unreadCount: 0,
          };
        });
      },

      deleteNotification: (notificationId) => {
        set((state) => {
          if (!state.currentUserId) return state;

          const userId = state.currentUserId;
          const currentUserNotifications = getUserNotifications(state, userId);
          const updatedUserNotifications = currentUserNotifications.filter(
            (notification) => notification.id !== notificationId,
          );

          return {
            notificationsByUser: {
              ...state.notificationsByUser,
              [userId]: updatedUserNotifications,
            },
            notifications: updatedUserNotifications,
            unreadCount: getUnreadCountFromList(updatedUserNotifications),
          };
        });
      },

      clearAll: () => {
        set((state) => {
          if (!state.currentUserId) return state;

          const userId = state.currentUserId;

          return {
            notificationsByUser: {
              ...state.notificationsByUser,
              [userId]: [],
            },
            notifications: [],
            unreadCount: 0,
          };
        });
      },

      getUnreadNotifications: () => {
        const state = get();
        return state.notifications.filter((notification) => !notification.read);
      },
    }),
    {
      name: "notifications-storage",
      partialize: (state) => ({
        notificationsByUser: state.notificationsByUser,
      }),
      migrate: (persistedState) => {
        if (!persistedState || typeof persistedState !== "object") {
          return { notificationsByUser: {} };
        }

        const candidate = persistedState.notificationsByUser ?? persistedState.notifications;

        if (Array.isArray(candidate)) {
          return { notificationsByUser: {} };
        }

        if (candidate && typeof candidate === "object") {
          const sanitizedNotificationsByUser = Object.fromEntries(
            Object.entries(candidate).map(([userId, userNotifications]) => [
              userId,
              ensureArray(userNotifications),
            ]),
          );
          return { notificationsByUser: sanitizedNotificationsByUser };
        }

        return { notificationsByUser: {} };
      },
    },
  ),
);

export default useNotificationStore;