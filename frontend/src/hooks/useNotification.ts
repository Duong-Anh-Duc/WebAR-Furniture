import { useCallback, useState } from 'react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

export const useNotification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback(
    (type: Notification['type'], message: string, duration: number = 3000) => {
      const id = Math.random().toString(36).substring(7);
      const notification: Notification = { id, type, message, duration };

      setNotifications((prev) => [...prev, notification]);

      if (duration > 0) {
        setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, duration);
      }
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return {
    notifications,
    showNotification,
    removeNotification,
    success: (message: string) => showNotification('success', message),
    error: (message: string) => showNotification('error', message),
    info: (message: string) => showNotification('info', message),
    warning: (message: string) => showNotification('warning', message),
  };
};
