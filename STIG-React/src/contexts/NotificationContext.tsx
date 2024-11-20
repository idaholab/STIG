import React, { createContext, useContext, useState } from 'react';

import { Notification } from '../types/Notification';
import { AlertType } from '@/components/elements/AlertComponent';

type NotificationContextType = {
  notification: Notification[];
  addNotification: (text: string, type: AlertType, sym?: symbol) => symbol;
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

let globalNotifications: Notification[] = [];

export const NotificationContextProvider: React.FC<Props> = ({ children }) => {
  const [notification, setNotification] = useState<Notification[]>([]);
  globalNotifications = notification;

  const addNotification = (text: string, type: AlertType, sym?: symbol) => {
    let obj: Notification | undefined;
    if (typeof sym === 'symbol') {
      obj = globalNotifications.find(n => n.s === sym && n.type === type);
      if (obj) {
        obj.text = text;
        obj.type = type;
        setNotification(globalNotifications.slice());
        return sym;
      }
      obj = { text, type, s: sym };
    } else {
      obj = {text, type, s: Symbol() };
    }

    globalNotifications.push(obj);
    if (globalNotifications.length > 10) {
      globalNotifications.shift();
    }
    setNotification(globalNotifications.slice());
    return obj.s;
  }

  const removeNotification = (i: number) => {
    setNotification(globalNotifications.toSpliced(i,1));
  }

  return (
    <NotificationContext.Provider value={{ 
      notification, addNotification, removeNotification
     }}>
      {children}
    </NotificationContext.Provider>
  );
};
