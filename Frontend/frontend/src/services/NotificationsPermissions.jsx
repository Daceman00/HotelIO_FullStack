// components/NotificationPermission.jsx
import { useEffect, useState } from 'react';

export const NotificationPermission = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (Notification.permission === 'default') {
      setShow(true);
    }
  }, []);

  const request = async () => {
    await Notification.requestPermission();
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-blue-600 text-white px-4 py-3 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <p className="text-sm">
          🔔 Enable notifications to get updates about bookings and offers!
        </p>
        <button
          onClick={request}
          className="bg-white text-blue-600 px-4 py-2 rounded text-sm font-medium"
        >
          Enable
        </button>
      </div>
    </div>
  );
};