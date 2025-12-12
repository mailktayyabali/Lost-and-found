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
    <div className="bg-white p-6 rounded-xl shadow border mt-6">
      <h2 className="text-lg font-bold mb-4">Recent Activity</h2>

      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th className="pb-3">Item Details</th>
            <th className="pb-3">Category</th>
            <th className="pb-3">Date Posted</th>
            <th className="pb-3">Status</th>
            <th className="pb-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-b last:border-b-0">

              <td className="py-4">
                <p className="font-semibold">{item.item}</p>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </td>

              <td>{item.category}</td>
              <td>{item.posted}</td>

              <td>
                <span className={`px-3 py-1 rounded-full text-sm ${item.badge}`}>
                  {item.status}
                </span>
              </td>

              <td className="flex gap-3 mt-3">
                <Pencil size={18} className="text-gray-600 cursor-pointer" />
                <Trash2 size={18} className="text-red-600 cursor-pointer" />
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
