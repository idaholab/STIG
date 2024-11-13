import React, { createContext, useContext, useState } from 'react';

import { Notification } from '../types/Notification';
import { AlertType } from '@/components/elements/AlertComponent';

type NotificationContextType = {
  notification: Notification[];
  addNotification: (text: string, type: AlertType) => void;
  removeNotification: (i: number) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationContextProvider');
  }
  return context;
};

type Props = {
  children: React.ReactNode;
};

export const NotificationContextProvider: React.FC<Props> = ({ children }) => {
  const [notification, setNotification] = useState<Notification[]>([]);

  const addNotification = (text: string, type: AlertType) => {
    notification.push({text, type});
    if (notification.length > 10) {
      notification.shift();
    }
    setNotification(notification.slice());
  }

  const removeNotification = (i: number) => {
    notification.splice(i,1);
    setNotification(notification.slice());
  }

  return (
    <NotificationContext.Provider value={{ 
      notification, addNotification, removeNotification
     }}>
      {children}
    </NotificationContext.Provider>
  );
};
