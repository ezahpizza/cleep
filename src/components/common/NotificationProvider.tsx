import React from 'react';
import { AnimatePresence, motion } from "framer-motion";
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from "react-icons/fi";
import { useEffect, useState } from "react";
import { Notification, NotificationContext } from "@/hooks/useNotifications";

interface NotificationProviderProps {
  children: React.ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { ...notification, id }]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ addNotification, removeNotification }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onRemove={() => removeNotification(notification.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}

const NOTIFICATION_TTL = 5000;

const NotificationItem = ({ 
  notification, 
  onRemove 
}: { 
  notification: Notification; 
  onRemove: () => void; 
}) => {
  useEffect(() => {
    const timeoutRef = setTimeout(() => {
      onRemove();
    }, NOTIFICATION_TTL);

    return () => clearTimeout(timeoutRef);
  }, [onRemove]);

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return FiCheckCircle;
      case 'error':
        return FiAlertCircle;
      case 'warning':
        return FiAlertCircle;
      case 'info':
      default:
        return FiInfo;
    }
  };

  const getColors = () => {
    switch (notification.type) {
      case 'success':
        return 'from-green-600 to-emerald-600';
      case 'error':
        return 'from-red-600 to-rose-600';
      case 'warning':
        return 'from-yellow-600 to-orange-600';
      case 'info':
      default:
        return 'from-blue-600 to-indigo-600';
    }
  };

  const Icon = getIcon();

  return (
    <motion.div
      layout
      initial={{ y: 15, scale: 0.9, opacity: 0 }}
      animate={{ y: 0, scale: 1, opacity: 1 }}
      exit={{ y: -25, scale: 0.9, opacity: 0 }}
      transition={{ type: "spring" }}
      className={`p-4 w-80 flex items-start rounded-lg gap-2 text-sm font-medium shadow-lg text-white bg-gradient-to-r ${getColors()}`}
    >
      <Icon className="text-2xl flex-shrink-0 mt-0.5" />
      <span className="flex-1">{notification.message}</span>
      <button onClick={onRemove} className="ml-auto mt-0.5 hover:bg-white/10 rounded p-1">
        <FiX />
      </button>
    </motion.div>
  );
};
