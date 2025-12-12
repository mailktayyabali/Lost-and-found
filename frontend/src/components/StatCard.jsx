export default function StatCard({ title, value, subtitle, icon, type, trend }) {
  // Determine the side color
  let sideColor = "";
  if (type === "lost") sideColor = "border-red-500";
  else if (type === "found") sideColor = "border-green-500";
  else if (type === "claim") sideColor = "border-blue-500";

  return (
    <div className={`flex items-center justify-between p-6 bg-white rounded-xl shadow border-l-4 ${sideColor} transform transition-transform duration-300 hover:scale-105`}>
      
      {/* Text content */}
      <div className="flex-1">
        <p className="text-gray-500 font-medium text-sm">{title}</p>
        <h2 className="text-2xl font-bold mt-1">{value}</h2>
        {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
        {trend && <p className="text-sm text-gray-400 mt-0.5">{trend}</p>}
      </div>

      {/* Icon on the right */}
      <div className="p-3 rounded-full bg-gray-100 text-gray-600 ml-4">
        {icon}
      </div>
    </div>
  );
}
