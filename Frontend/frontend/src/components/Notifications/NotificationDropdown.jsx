// components/Notifications/NotificationDropdown.jsx
import { useNavigate } from "react-router-dom";
import useNotificationStore from "../../stores/NotificationStore";
import { NotificationItem } from "./NotificationItem";
import { BellIcon } from "@heroicons/react/24/outline";

export const NotificationDropdown = ({ onClose }) => {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAllAsRead, clearAll } =
    useNotificationStore();

  const handleNavigate = (link) => {
    if (link) {
      navigate(link);
      onClose();
    }
  };

  return (
    <div className="flex flex-col max-h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Notifications
          </h3>
          {unreadCount > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {unreadCount} unread
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm("Clear all notifications?")) {
                  clearAll();
                }
              }}
              className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="overflow-y-auto flex-1">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
              <BellIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              No notifications
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              You're all caught up! 🎉
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {notifications?.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onNavigate={handleNavigate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
