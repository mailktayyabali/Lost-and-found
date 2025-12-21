import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const SearchAlertsContext = createContext();

export const useSearchAlerts = () => useContext(SearchAlertsContext);

export const SearchAlertsProvider = ({ children }) => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user) {
      loadAlerts();
      loadNotifications();
    }
  }, [user]);

  const loadAlerts = () => {
    if (!user) return;
    
    const stored = localStorage.getItem("findit_search_alerts");
    if (stored) {
      const allAlerts = JSON.parse(stored);
      const userAlerts = allAlerts[user.email] || [];
      setAlerts(userAlerts);
    }
  };

  const loadNotifications = () => {
    if (!user) return;
    
    const stored = localStorage.getItem("findit_alert_notifications");
    if (stored) {
      const allNotifications = JSON.parse(stored);
      const userNotifications = allNotifications[user.email] || [];
      setNotifications(userNotifications);
    }
  };

  const saveAlerts = (newAlerts) => {
    if (!user) return;
    
    const stored = localStorage.getItem("findit_search_alerts");
    const allAlerts = stored ? JSON.parse(stored) : {};
    allAlerts[user.email] = newAlerts;
    localStorage.setItem("findit_search_alerts", JSON.stringify(allAlerts));
    setAlerts(newAlerts);
  };

  const saveNotifications = (newNotifications) => {
    if (!user) return;
    
    const stored = localStorage.getItem("findit_alert_notifications");
    const allNotifications = stored ? JSON.parse(stored) : {};
    allNotifications[user.email] = newNotifications;
    localStorage.setItem("findit_alert_notifications", JSON.stringify(allNotifications));
    setNotifications(newNotifications);
  };

  const createAlert = (alertData) => {
    if (!user) return null;

    const newAlert = {
      id: Date.now().toString(),
      userId: user.email,
      name: alertData.name,
      filters: alertData.filters,
      active: true,
      createdAt: new Date().toISOString(),
    };

    const updated = [...alerts, newAlert];
    saveAlerts(updated);
    return newAlert;
  };

  const updateAlert = (alertId, updates) => {
    const updated = alerts.map((alert) =>
      alert.id === alertId ? { ...alert, ...updates } : alert
    );
    saveAlerts(updated);
  };

  const deleteAlert = (alertId) => {
    const updated = alerts.filter((alert) => alert.id !== alertId);
    saveAlerts(updated);
  };

  const toggleAlert = (alertId) => {
    const alert = alerts.find((a) => a.id === alertId);
    if (alert) {
      updateAlert(alertId, { active: !alert.active });
    }
  };

  const addNotification = (alertId, itemId, itemTitle) => {
    if (!user) return;

    const notification = {
      id: Date.now().toString(),
      alertId,
      itemId,
      itemTitle,
      read: false,
      createdAt: new Date().toISOString(),
    };

    const updated = [...notifications, notification];
    saveNotifications(updated);
  };

  const markNotificationAsRead = (notificationId) => {
    const updated = notifications.map((notif) =>
      notif.id === notificationId ? { ...notif, read: true } : notif
    );
    saveNotifications(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map((notif) => ({ ...notif, read: true }));
    saveNotifications(updated);
  };

  const getUnreadCount = () => {
    return notifications.filter((n) => !n.read).length;
  };

  return (
    <SearchAlertsContext.Provider
      value={{
        alerts,
        notifications,
        createAlert,
        updateAlert,
        deleteAlert,
        toggleAlert,
        addNotification,
        markNotificationAsRead,
        markAllAsRead,
        getUnreadCount,
      }}
    >
      {children}
    </SearchAlertsContext.Provider>
  );
};

