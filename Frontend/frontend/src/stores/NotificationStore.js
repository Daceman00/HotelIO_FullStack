// stores/notificationStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useNotificationStore = create(
    persist(
        (set, get) => ({
            notifications: [],
            unreadCount: 0,

            // Add new notification
            addNotification: (notification) => {
                set((state) => {
                    // Check if notification already exists (prevent duplicates)
                    const exists = state.notifications.some(n => n.id === notification.id);
                    if (exists) return state;

                    const newNotifications = [notification, ...state.notifications].slice(0, 50); // Keep last 50
                    const unreadCount = newNotifications.filter(n => !n.read).length;

                    return {
                        notifications: newNotifications,
                        unreadCount
                    };
                });
            },

            // Mark notification as read
            markAsRead: (notificationId) => {
                set((state) => {
                    const updatedNotifications = state.notifications.map((notif) =>
                        notif.id === notificationId ? { ...notif, read: true } : notif
                    );
                    const unreadCount = updatedNotifications.filter(n => !n.read).length;

                    return {
                        notifications: updatedNotifications,
                        unreadCount
                    };
                });
            },

            // Mark all as read
            markAllAsRead: () => {
                set((state) => ({
                    notifications: state.notifications.map((notif) => ({
                        ...notif,
                        read: true
                    })),
                    unreadCount: 0
                }));
            },

            // Delete notification
            deleteNotification: (notificationId) => {
                set((state) => {
                    const updatedNotifications = state.notifications.filter(
                        (notif) => notif.id !== notificationId
                    );
                    const unreadCount = updatedNotifications.filter(n => !n.read).length;

                    return {
                        notifications: updatedNotifications,
                        unreadCount
                    };
                });
            },

            // Clear all notifications
            clearAll: () => {
                set({
                    notifications: [],
                    unreadCount: 0
                });
            },

            // Get unread notifications
            getUnreadNotifications: () => {
                return get().notifications.filter((notif) => !notif.read);
            }
        }),
        {
            name: 'notifications-storage', // LocalStorage key
            partialize: (state) => ({
                notifications: state.notifications.slice(0, 50), // Keep last 50
                unreadCount: state.unreadCount
            })
        }
    )
);

export default useNotificationStore;