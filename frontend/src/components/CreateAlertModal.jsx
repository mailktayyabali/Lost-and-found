import { useState } from "react";
import { X } from "lucide-react";

function CreateAlertModal({ isOpen, onClose, onCreate, currentFilters }) {
  const [name, setName] = useState("");
  const [filters, setFilters] = useState(currentFilters || {});

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter a name for your alert");
      return;
    }

    onCreate({
      name: name.trim(),
      filters: {
        type: filters.type || null,
        category: filters.category || null,
        location: filters.location || null,
        keywords: filters.keywords || null,
        dateFrom: filters.dateFrom || null,
        dateTo: filters.dateTo || null,
      },
    });

    setName("");
    setFilters({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-navy">Create Search Alert</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-navy mb-2">
              Alert Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Lost Electronics in NYC"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-2">
              Type
            </label>
            <select
              value={filters.type || ""}
              onChange={(e) =>
                setFilters({ ...filters, type: e.target.value || null })
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal text-sm"
            >
              <option value="">All Types</option>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-2">
              Category
            </label>
            <select
              value={filters.category || ""}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value || null })
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal text-sm"
            >
              <option value="">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="accessories">Accessories</option>
              <option value="clothing">Clothing</option>
              <option value="documents">Documents</option>
              <option value="pets">Pets</option>
              <option value="keys">Keys</option>
              <option value="bags">Bags</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-2">
              Location
            </label>
            <input
              type="text"
              value={filters.location || ""}
              onChange={(e) =>
                setFilters({ ...filters, location: e.target.value || null })
              }
              placeholder="e.g., New York"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-2">
              Keywords
            </label>
            <input
              type="text"
              value={filters.keywords || ""}
              onChange={(e) =>
                setFilters({ ...filters, keywords: e.target.value || null })
              }
              placeholder="e.g., iPhone, wallet"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal text-sm"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 text-navy rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-teal text-white rounded-lg hover:bg-teal-dark transition-colors font-medium"
            >
              Create Alert
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateAlertModal;

