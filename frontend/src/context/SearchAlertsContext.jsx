import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { alertsApi } from "../services/alertsApi";

const SearchAlertsContext = createContext();

export const useSearchAlerts = () => useContext(SearchAlertsContext);

export const SearchAlertsProvider = ({ children }) => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadAlerts();
    } else {
      setAlerts([]);
      setNotifications([]);
    }
  }, [user]);

  const loadAlerts = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await alertsApi.getAlerts();
      if (response.success) {
        const fetchedAlerts = response.data?.alerts || response.data || [];
        const transformedAlerts = fetchedAlerts.map((alert) => ({
          ...alert,
          id: alert.id || alert._id,
        }));
        setAlerts(transformedAlerts);
      }
    } catch (error) {
      console.error("Failed to load alerts:", error);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  const createAlert = async (alertData) => {
    if (!user) return null;

    try {
      // Transform frontend format to backend format
      const backendData = {
        name: alertData.name,
        filters: {
          type: alertData.filters?.type || alertData.type,
          category: alertData.filters?.category || alertData.category,
          keywords: alertData.filters?.keywords || alertData.keywords || [],
        },
      };

      const response = await alertsApi.createAlert(backendData);
      if (response.success) {
        const newAlert = response.data?.alert || response.data;
        setAlerts([...alerts, { ...newAlert, id: newAlert.id || newAlert._id }]);
        return newAlert;
      }
      return null;
    } catch (error) {
      console.error("Failed to create alert:", error);
      return null;
    }
  };

  const updateAlert = async (alertId, updates) => {
    try {
      // Transform frontend format to backend format
      const backendData = {
        name: updates.name,
        filters: {
          type: updates.filters?.type || updates.type,
          category: updates.filters?.category || updates.category,
          keywords: updates.filters?.keywords || updates.keywords || [],
        },
      };

      const response = await alertsApi.updateAlert(alertId, backendData);
      if (response.success) {
        const updatedAlert = response.data?.alert || response.data;
        setAlerts(alerts.map((alert) =>
          alert.id === alertId ? { ...updatedAlert, id: updatedAlert.id || updatedAlert._id } : alert
        ));
        return updatedAlert;
      }
      return null;
    } catch (error) {
      console.error("Failed to update alert:", error);
      return null;
    }
  };

  const deleteAlert = async (alertId) => {
    try {
      const response = await alertsApi.deleteAlert(alertId);
      if (response.success) {
        setAlerts(alerts.filter((alert) => alert.id !== alertId));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to delete alert:", error);
      return false;
    }
  };

  const toggleAlert = async (alertId) => {
    const alert = alerts.find((a) => a.id === alertId);
    if (alert) {
      await updateAlert(alertId, { ...alert, active: !alert.active });
    }
  };

  const checkMatches = async (alertId) => {
    try {
      const response = await alertsApi.checkMatches(alertId);
      if (response.success) {
        const matches = response.data?.matches || response.data || [];
        // Add notifications for new matches
        matches.forEach((match) => {
          addNotification(alertId, match.id || match._id, match.title);
        });
        return matches;
      }
      return [];
    } catch (error) {
      console.error("Failed to check matches:", error);
      return [];
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

    setNotifications([...notifications, notification]);
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(notifications.map((notif) =>
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
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
        checkMatches,
        addNotification,
        markNotificationAsRead,
        markAllAsRead,
        getUnreadCount,
        loadAlerts,
        loading,
      }}
    >
      {children}
    </SearchAlertsContext.Provider>
  );
};

