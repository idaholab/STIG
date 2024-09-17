import React from 'react';
import AlertComponent from '../elements/AlertComponent';
import Toast from '../elements/Toast';
import { useNotificationContext } from '@/contexts/NotificationContext';

const Notifications: React.FC = () => {
  const { notifications, removeNotification } = useNotificationContext();

  return (
    <Toast>
      {
        notifications.map(notification => {
          return (
            <AlertComponent
              key={notification.id}
              alertText={notification.text}
              alertType={notification.type}
              userClosable
              onClose={() => {removeNotification(notification.id)}}
            />
          );
        })
      }
    </Toast>
  );
};

export default Notifications;