import { useSearchAlerts } from "../context/SearchAlertsContext";

function AlertCard({ alert }) {
  const { toggleAlert, deleteAlert } = useSearchAlerts();

  const getFilterSummary = () => {
    const parts = [];
    if (alert.filters.type) parts.push(`Type: ${alert.filters.type}`);
    if (alert.filters.category) parts.push(`Category: ${alert.filters.category}`);
    if (alert.filters.location) parts.push(`Location: ${alert.filters.location}`);
    if (alert.filters.keywords) parts.push(`Keywords: ${alert.filters.keywords}`);
    return parts.length > 0 ? parts.join(", ") : "No filters";
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-navy mb-1">{alert.name}</h3>
          <p className="text-sm text-slate">{getFilterSummary()}</p>
          <p className="text-xs text-slate mt-2">
            Created {new Date(alert.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleAlert(alert.id)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              alert.active
                ? "bg-teal/10 text-teal"
                : "bg-gray-100 text-slate"
            }`}
          >
            {alert.active ? "Active" : "Inactive"}
          </button>
          <button
            onClick={() => deleteAlert(alert.id)}
            className="p-1 text-red-400 hover:text-red-600 transition-colors"
            title="Delete alert"
          >
            <i className="fa-solid fa-trash text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AlertCard;

