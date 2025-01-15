import React from 'react';
import AlertComponent from '../elements/AlertComponent';
import Toast from '../elements/Toast';
import { useNotificationContext } from '@/contexts/NotificationContext';

const Notifications: React.FC = () => {
  const { notification, removeNotification } = useNotificationContext();
  return notification && <Toast>
    {notification.map(({ text, type }, i) =>
      <AlertComponent
        key={i}
        alertText={text}
        alertType={type}
        userClosable
        onClose={() => removeNotification(i)}
        className={'flex items-start max-w-[440px] max-h-[150px] overflow-y-auto z-40 whitespace-pre-line'}
      />
    )}
  </Toast>;
};

export default Notifications;