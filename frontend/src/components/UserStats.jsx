import RatingDisplay from "./RatingDisplay";

function UserStats({ stats }) {
  if (!stats) return null;

  const statItems = [
    {
      label: "Rating",
      value: <RatingDisplay rating={stats.rating} size="large" />,
      icon: "fa-star",
    },
    {
      label: "Reviews",
      value: stats.reviewCount,
      icon: "fa-comment",
    },
    {
      label: "Items Posted",
      value: stats.itemsPosted,
      icon: "fa-file",
    },
    {
      label: "Items Found",
      value: stats.itemsFound,
      icon: "fa-check-circle",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {statItems.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center"
        >
          <div className="text-teal mb-2">
            <i className={`fa-solid ${stat.icon} text-2xl`}></i>
          </div>
          <div className="text-2xl font-bold text-navy mb-1">{stat.value}</div>
          <div className="text-xs text-slate uppercase tracking-wide">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}

export default UserStats;

