import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Notification } from '../types/Notification';
import { AlertType } from '@/components/elements/AlertComponent';

type NotificationContextType = {
  notifications: Notification[];
  addNotification: (text: string, type: AlertType) => void;
  removeNotification: (id: string) => void;
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
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (text: string, type: AlertType) => {
    setNotifications([...notifications, {id: uuidv4(), text: text, type: type}]);
  }

  const removeNotification = (id: string) => {
    setNotifications([...notifications].filter(notification => {
      return notification.id !== id;
    }));
  }

  return (
    <NotificationContext.Provider value={{ 
      notifications, addNotification, removeNotification
     }}>
      {children}
    </NotificationContext.Provider>
  );
};
