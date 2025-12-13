import { Pencil, Trash2 } from "lucide-react";

export default function ActivityTable() {
  const data = [
    {
      item: "Blue North Face Backpack",
      desc: "Lost near Central Library",
      category: "Bags & Luggage",
      posted: "Oct 24, 2023",
      status: "Pending",
      badge: "bg-red-100 text-red-600",
    },
    {
      item: "iPhone 13 Pro Max",
      desc: "Found in Cafeteria",
      category: "Electronics",
      posted: "Oct 22, 2023",
      status: "Found",
      badge: "bg-green-100 text-green-600",
    },
    {
      item: "Golden Retriever (Max)",
      desc: "Lost in City Park",
      category: "Pets",
      posted: "Oct 15, 2023",
      status: "Claimed",
      badge: "bg-blue-100 text-blue-600",
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
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Pencil size={18} className="text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={18} className="text-red-600" />
                    </button>
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
            <div className="flex gap-3 pt-3 border-t border-gray-200">
              <button className="flex-1 flex items-center justify-center gap-2 p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                <Pencil size={16} className="text-gray-600" />
                <span className="text-sm text-gray-700">Edit</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 p-2 border border-red-300 rounded-lg hover:bg-red-50 transition-colors">
                <Trash2 size={16} className="text-red-600" />
                <span className="text-sm text-red-600">Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
