// components/Notifications/NotificationItem.jsx
import { 
    CheckCircleIcon,
    GiftIcon,
    CreditCardIcon,
    SparklesIcon,
    UserGroupIcon,
    MegaphoneIcon,
    XCircleIcon,
    InformationCircleIcon,
    TrashIcon,
    HandThumbUpIcon
  } from '@heroicons/react/24/outline';
  import useNotificationStore from '../../stores/NotificationStore';
  import { formatTimeAgo } from '../../helpers/timeAgo';
  
  export const NotificationItem = ({ notification, onNavigate }) => {
    const { markAsRead, deleteNotification } = useNotificationStore();
  
    const handleClick = () => {
      if (!notification.read) {
        markAsRead(notification.id);
      }
      if (notification.link) {
        onNavigate(notification.link);
      }
    };
  
    const handleDelete = (e) => {
      e.stopPropagation();
      deleteNotification(notification.id);
    };
  
    // Get icon and styling based on notification type
    const getNotificationConfig = (type) => {
      const configs = {
        booking: {
          Icon: CheckCircleIcon,
          bgColor: 'bg-green-100 dark:bg-green-900/30',
          iconColor: 'text-green-600 dark:text-green-400',
          borderColor: 'border-green-200 dark:border-green-800'
        },
        discount: {
          Icon: GiftIcon,
          bgColor: 'bg-purple-100 dark:bg-purple-900/30',
          iconColor: 'text-purple-600 dark:text-purple-400',
          borderColor: 'border-purple-200 dark:border-purple-800'
        },
        payment: {
          Icon: CreditCardIcon,
          bgColor: 'bg-blue-100 dark:bg-blue-900/30',
          iconColor: 'text-blue-600 dark:text-blue-400',
          borderColor: 'border-blue-200 dark:border-blue-800'
        },
        points: {
          Icon: SparklesIcon,
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
          iconColor: 'text-yellow-600 dark:text-yellow-400',
          borderColor: 'border-yellow-200 dark:border-yellow-800'
        },
        referral: {
          Icon: UserGroupIcon,
          bgColor: 'bg-pink-100 dark:bg-pink-900/30',
          iconColor: 'text-pink-600 dark:text-pink-400',
          borderColor: 'border-pink-200 dark:border-pink-800'
        },
        promotion: {
          Icon: MegaphoneIcon,
          bgColor: 'bg-orange-100 dark:bg-orange-900/30',
          iconColor: 'text-orange-600 dark:text-orange-400',
          borderColor: 'border-orange-200 dark:border-orange-800'
        },
        welcome: {
          Icon: HandThumbUpIcon,
          bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
          iconColor: 'text-indigo-600 dark:text-indigo-400',
          borderColor: 'border-indigo-200 dark:border-indigo-800'
        },
        cancellation: {
          Icon: XCircleIcon,
          bgColor: 'bg-red-100 dark:bg-red-900/30',
          iconColor: 'text-red-600 dark:text-red-400',
          borderColor: 'border-red-200 dark:border-red-800'
        },
        booking_update: {
          Icon: InformationCircleIcon,
          bgColor: 'bg-teal-100 dark:bg-teal-900/30',
          iconColor: 'text-teal-600 dark:text-teal-400',
          borderColor: 'border-teal-200 dark:border-teal-800'
        },
        info: {
          Icon: InformationCircleIcon,
          bgColor: 'bg-gray-100 dark:bg-gray-700',
          iconColor: 'text-gray-600 dark:text-gray-400',
          borderColor: 'border-gray-200 dark:border-gray-600'
        }
      };
  
      return configs[type] || configs.info;
    };
  
    const { Icon, bgColor, iconColor, borderColor } = getNotificationConfig(notification.type);
  
    return (
      <div
        onClick={handleClick}
        className={`
          relative p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 
          cursor-pointer transition-all duration-200
          ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/10 border-l-4 ' + borderColor : ''}
        `}
      >
        <div className="flex gap-3">
          {/* Icon */}
          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${bgColor}`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
  
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className={`text-sm font-semibold ${
                !notification.read 
                  ? 'text-gray-900 dark:text-white' 
                  : 'text-gray-700 dark:text-gray-300'
              }`}>
                {notification.title}
              </h4>
              
              {!notification.read && (
                <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full flex-shrink-0 mt-1"></span>
              )}
            </div>
  
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
              {notification.message}
            </p>
  
            {/* Additional data display based on type */}
            {notification.data && (
              <div className="mb-2">
                {notification.type === 'booking' && notification.data.roomName && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded px-2 py-1 inline-block">
                    🏨 {notification.data.roomName}
                  </div>
                )}
                {notification.type === 'discount' && notification.data.discountPercentage && (
                  <div className="text-xs text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 rounded px-2 py-1 inline-block font-medium">
                    🎁 {notification.data.discountPercentage}% OFF
                  </div>
                )}
                {notification.type === 'payment' && notification.data.amount && (
                  <div className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 rounded px-2 py-1 inline-block font-medium">
                    💳 ${notification.data.amount}
                  </div>
                )}
                {notification.type === 'points' && notification.data.pointsEarned && (
                  <div className="text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 rounded px-2 py-1 inline-block font-medium">
                    ⭐ +{notification.data.pointsEarned} points
                    {notification.data.totalPoints && (
                      <span className="ml-1 text-gray-500">
                        (Total: {notification.data.totalPoints})
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
  
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {formatTimeAgo(notification.timestamp)}
              </p>
              
              {notification.link && (
                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline">
                  View details →
                </span>
              )}
            </div>
          </div>
  
          {/* Delete Button */}
          <button
            onClick={handleDelete}
            className="flex-shrink-0 p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded"
            aria-label="Delete notification"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };