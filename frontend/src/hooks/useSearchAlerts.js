// This hook is for matching items against alerts
// Note: This is a utility function, not a React hook
export const matchItemsToAlerts = (items, alerts, filterFn) => {
  const matches = [];

  alerts.forEach((alert) => {
    if (!alert.active) return;

    const filtered = filterFn(items, {
      ...alert.filters,
      type: alert.filters.type || "all",
    });

    filtered.forEach((item) => {
      matches.push({
        alertId: alert.id,
        alertName: alert.name,
        item,
      });
    });
  });

  return matches;
};

