
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { alertsApi } from "../services/alertsApi";
import { notificationsApi } from "../services/notificationsApi";

const SearchAlertsContext = createContext();

export const useSearchAlerts = () => useContext(SearchAlertsContext);

export const SearchAlertsProvider = ({ children }) => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      loadAlerts();
      loadNotifications();
    } else {
      setAlerts([]);
      setNotifications([]);
      setUnreadCount(0);
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

  const loadNotifications = async () => {
    if (!user) return;
    try {
      const response = await notificationsApi.getNotifications({ limit: 20 });
      if (response.success) {
        const rawNotifications = response.data.notifications || [];
        const formattedNotifications = rawNotifications.map(n => ({
          ...n,
          id: n._id,
          itemId: n.data?.itemId?._id || n.data?.itemId,
          itemTitle: n.data?.itemId?.title || n.data?.item?.title || 'Item',
          alertName: n.data?.alertId?.name || 'Search Alert',
        }));
        setNotifications(formattedNotifications);
        setUnreadCount(response.data.unreadCount || 0);
      }
    } catch (error) {
      console.error("Failed to load notifications:", error);
    }
  };

  const createAlert = async (alertData) => {
    if (!user) return null;

    try {
      console.log("[SearchAlertsContext] Creating alert with data:", alertData);
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
      console.log("[SearchAlertsContext] Create alert response:", response);

      if (response.success) {
        const newAlert = response.data?.alert || response.data;
        console.log("[SearchAlertsContext] New alert object:", newAlert);

        const alertWithId = { ...newAlert, id: newAlert.id || newAlert._id };
        setAlerts(prevAlerts => [...prevAlerts, alertWithId]);

        return newAlert;
      } else {
        console.error("[SearchAlertsContext] API returned success: false", response);
      }
      return null;
    } catch (error) {
      console.error("Failed to create alert:", error);
      return null;
    }
  };

  const updateAlert = async (alertId, updates) => {
    try {
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
        await loadNotifications();
        return matches;
      }
      return [];
    } catch (error) {
      console.error("Failed to check matches:", error);
      return [];
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      setNotifications(notifications.map((notif) =>
        notif._id === notificationId ? { ...notif, read: true } : notif
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));

      await notificationsApi.markAsRead(notificationId);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
      setUnreadCount(0);

      await notificationsApi.markAllAsRead();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const getUnreadCount = () => {
    return unreadCount;
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
        markNotificationAsRead,
        markAllAsRead,
        getUnreadCount,
        loadAlerts,
        loadNotifications,
        loading,
      }}
    >
      {children}
    </SearchAlertsContext.Provider>
  );
};

