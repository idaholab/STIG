import React from 'react';
import AlertComponent from '../elements/AlertComponent';
import Toast from '../elements/Toast';
import { useNotificationContext } from '@/contexts/NotificationContext';

const Notifications: React.FC = () => {
  const { notification, removeNotification } = useNotificationContext();

  return (
    notification && 
      <Toast>
        <AlertComponent
          alertText={notification.text}
          alertType={notification.type}
          userClosable
          onClose={() => {removeNotification()}}
        />
      </Toast>
  );
};

export default Notifications;