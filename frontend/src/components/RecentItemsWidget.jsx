import { Link } from "react-router-dom";
import { posts } from "../data/posts";
import { Clock } from "lucide-react";

function RecentItemsWidget() {
  const recentItems = posts
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-navy">Recent Items</h2>
        <Link
          to="/feed"
          className="text-sm text-teal hover:underline font-medium"
        >
          View All
        </Link>
      </div>
      <div className="space-y-3">
        {recentItems.map((item) => (
          <Link
            key={item.id}
            to={`/item/${item.id}`}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100 group"
          >
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    item.status === "LOST"
                      ? "bg-red-100 text-red-600"
                      : item.status === "FOUND"
                      ? "bg-green-100 text-green-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <p className="font-medium text-navy text-sm truncate group-hover:text-teal transition-colors">
                {item.title}
              </p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-slate flex items-center gap-1">
                  <Clock size={10} />
                  {item.date}
                </span>
                <span className="text-xs text-slate truncate">{item.location}</span>
              </div>
            </div>
            <i className="fa-solid fa-chevron-right text-gray-400 group-hover:text-teal transition-colors"></i>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default RecentItemsWidget;

