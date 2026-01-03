import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { itemsApi } from "../services/itemsApi";
import { useState, useEffect } from "react";

export default function ActivityTable() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      if (!user) return;
      try {
        const response = await itemsApi.getUserItems(user.id);
        if (response.success) {
          const userItems = response.data.items || response.data || [];
          setItems(userItems.slice(0, 5)); // Limit to 5 recent items
        }
      } catch (err) {
        console.error("Failed to fetch user items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [user]);

  const data = items.length > 0
    ? items.filter(post => post && (post.id || post._id)).map((post) => ({
      id: post.id || post._id,
      item: post.title || "Untitled Item",
      desc: post.description || "No description",
      category: post.category || "Other",
      posted: post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Unknown date",
      status: post.status || "UNKNOWN",
      badge:
        (post.status === "LOST")
          ? "bg-red-100 text-red-600"
          : (post.status === "FOUND")
            ? "bg-green-100 text-green-600"
            : "bg-blue-100 text-blue-600",
    }))
    : [
      {
        id: null, // Ensure ID is null for empty state
        item: loading ? "Loading..." : "No items reported yet",
        desc: loading ? "Fetching your activities" : "Start by reporting a lost or found item",
        category: "-",
        posted: "-",
        status: "Empty",
        badge: "bg-gray-100 text-gray-600",
      },
    ];

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-md border border-gray-100 mt-6">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <h2 className="text-lg md:text-xl font-bold text-gray-800">Recent Activity</h2>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-3 font-semibold">Item Details</th>
              <th className="pb-3 font-semibold">Category</th>
              <th className="pb-3 font-semibold">Date Posted</th>
              <th className="pb-3 font-semibold">Status</th>
              <th className="pb-3 font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-b last:border-b-0 hover:bg-gray-50 transition-colors">
                <td className="py-4">
                  <p className="font-semibold text-gray-800">{item.item}</p>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </td>
                <td className="py-4 text-gray-700">{item.category}</td>
                <td className="py-4 text-gray-700">{item.posted}</td>
                <td className="py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.badge}`}>
                    {item.status}
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex gap-3">
                    {item.id && (
                      <>
                        <button
                          onClick={() => navigate(`/item/${item.id}`)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <i className="fa-solid fa-eye text-gray-600"></i>
                        </button>
                        <button
                          onClick={() => navigate("/my-reports")}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil size={18} className="text-gray-600" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {data.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <p className="font-semibold text-gray-800 mb-1">{item.item}</p>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${item.badge}`}>
                {item.status}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
              <div>
                <span className="font-medium">Category: </span>
                {item.category}
              </div>
              <div>
                <span className="font-medium">Date: </span>
                {item.posted}
              </div>
            </div>
            {item.id && (
              <div className="flex gap-3 pt-3 border-t border-gray-200">
                <button
                  onClick={() => navigate(`/item/${item.id}`)}
                  className="flex-1 flex items-center justify-center gap-2 p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <i className="fa-solid fa-eye text-gray-600"></i>
                  <span className="text-sm text-gray-700">View</span>
                </button>
                <button
                  onClick={() => navigate("/my-reports")}
                  className="flex-1 flex items-center justify-center gap-2 p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Pencil size={16} className="text-gray-600" />
                  <span className="text-sm text-gray-700">Edit</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
