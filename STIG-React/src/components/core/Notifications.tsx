import React from 'react';
import AlertComponent from '../elements/AlertComponent';
import Toast from '../elements/Toast';
import { useNotificationContext } from '@/contexts/NotificationContext';

const Notifications: React.FC = () => {
  const { notification, removeNotification } = useNotificationContext();
  return notification && <Toast>
    {notification.map(({text, type}, i) => 
      <AlertComponent
        key={i}
        alertText={text}
        alertType={type}
        userClosable
        onClose={() => removeNotification(i)}
      />
    )}
  </Toast>;
};

export default Notifications;