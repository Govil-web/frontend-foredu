// src/hooks/useNotification.ts
import useNotificationStore from '../store/notificationStore';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface UseNotificationReturn {
  showNotification: (message: string, type: NotificationType, duration?: number) => void;
  hideNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const useNotification = (): UseNotificationReturn => {
  const { addNotification, removeNotification, clearAll } = useNotificationStore();

  const showNotification = (
    message: string, 
    type: NotificationType = 'info', 
    duration = 6000
  ): void => {
    return addNotification({
      message,
      type,
      autoHideDuration: duration,
    });
  };

  return {
    showNotification,
    hideNotification: removeNotification,
    clearAllNotifications: clearAll,
  };
};

export default useNotification;