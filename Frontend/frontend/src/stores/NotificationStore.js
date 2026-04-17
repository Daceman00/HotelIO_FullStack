// stores/notificationStore.js - User-scoped version
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useNotificationStore = create(
    persist(
        (set, get) => ({
            notifications: {},  // Changed: Object with userId as key
            currentUserId: null,

            // Set current user (call this on login)
            setCurrentUser: (userId) => {
                set({ currentUserId: userId });
            },

            // Clear current user (call this on logout)
            clearCurrentUser: () => {
                set({ currentUserId: null });
            },

            // Get notifications for current user
            getCurrentUserNotifications: () => {
                const state = get();
                if (!state.currentUserId) return [];
                return state.notifications[state.currentUserId] || [];
            },

            // Get unread count for current user
            getUnreadCount: () => {
                const state = get();
                if (!state.currentUserId) return 0;
                const userNotifications = state.notifications[state.currentUserId] || [];
                return userNotifications.filter(n => !n.read).length;
            },

            // Add new notification for current user
            addNotification: (notification) => {
                set((state) => {
                    if (!state.currentUserId) {
                        console.warn('No current user set, cannot add notification');
                        return state;
                    }

                    const userId = state.currentUserId;
                    const userNotifications = state.notifications[userId] || [];

                    // Check if notification already exists (prevent duplicates)
                    const exists = userNotifications.some(n => n.id === notification.id);
                    if (exists) return state;

                    // Add notification and keep last 50 per user
                    const newUserNotifications = [notification, ...userNotifications].slice(0, 50);

                    return {
                        notifications: {
                            ...state.notifications,
                            [userId]: newUserNotifications
                        }
                    };
                });
            },

            // Mark notification as read
            markAsRead: (notificationId) => {
                set((state) => {
                    if (!state.currentUserId) return state;

                    const userId = state.currentUserId;
                    const userNotifications = state.notifications[userId] || [];

                    const updatedNotifications = userNotifications.map((notif) =>
                        notif.id === notificationId ? { ...notif, read: true } : notif
                    );

                    return {
                        notifications: {
                            ...state.notifications,
                            [userId]: updatedNotifications
                        }
                    };
                });
            },

            // Mark all as read for current user
            markAllAsRead: () => {
                set((state) => {
                    if (!state.currentUserId) return state;

                    const userId = state.currentUserId;
                    const userNotifications = state.notifications[userId] || [];

                    const updatedNotifications = userNotifications.map((notif) => ({
                        ...notif,
                        read: true
                    }));

                    return {
                        notifications: {
                            ...state.notifications,
                            [userId]: updatedNotifications
                        }
                    };
                });
            },

            // Delete notification
            deleteNotification: (notificationId) => {
                set((state) => {
                    if (!state.currentUserId) return state;

                    const userId = state.currentUserId;
                    const userNotifications = state.notifications[userId] || [];

                    const updatedNotifications = userNotifications.filter(
                        (notif) => notif.id !== notificationId
                    );

                    return {
                        notifications: {
                            ...state.notifications,
                            [userId]: updatedNotifications
                        }
                    };
                });
            },

            // Clear all notifications for current user
            clearAll: () => {
                set((state) => {
                    if (!state.currentUserId) return state;

                    const userId = state.currentUserId;

                    return {
                        notifications: {
                            ...state.notifications,
                            [userId]: []
                        }
                    };
                });
            },

            // Get unread notifications for current user
            getUnreadNotifications: () => {
                const state = get();
                if (!state.currentUserId) return [];
                const userNotifications = state.notifications[state.currentUserId] || [];
                return userNotifications.filter((notif) => !notif.read);
            }
        }),
        {
            name: 'notifications-storage', // LocalStorage key
            partialize: (state) => ({
                notifications: state.notifications, // Store all users' notifications
                // Don't persist currentUserId - it should be set on each login
            })
        }
    )
);

export default useNotificationStore;