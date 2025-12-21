export default function StatCard({ title, value, subtitle, icon, type, trend }) {
  // Determine the side color and icon background color
  let sideColor = "";
  let iconBgColor = "";
  
  if (type === "lost") {
    sideColor = "border-red-500";
    iconBgColor = "bg-red-100 text-red-600";
  } else if (type === "found") {
    sideColor = "border-green-500";
    iconBgColor = "bg-green-100 text-green-600";
  } else if (type === "claim") {
    sideColor = "border-blue-500";
    iconBgColor = "bg-blue-100 text-blue-600";
  } else if (type === "info") {
    sideColor = "border-teal";
    iconBgColor = "bg-teal/10 text-teal";
  } else {
    sideColor = "border-gray-300";
    iconBgColor = "bg-gray-100 text-gray-600";
  }

  return (
    <div className={`flex items-center justify-between p-5 md:p-6 bg-white rounded-xl shadow-md hover:shadow-lg border-l-4 ${sideColor} transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1`}>
      {/* Text content */}
      <div className="flex-1 min-w-0">
        <p className="text-gray-500 font-medium text-xs md:text-sm uppercase tracking-wide">{title}</p>
        <h2 className="text-2xl md:text-3xl font-bold mt-1 text-gray-800">{value}</h2>
        {subtitle && <p className="text-gray-400 text-xs md:text-sm mt-1">{subtitle}</p>}
        {trend && <p className="text-sm text-gray-400 mt-0.5">{trend}</p>}
      </div>

      {/* Icon on the right */}
      <div className={`p-3 md:p-4 rounded-full ${iconBgColor} ml-4 flex-shrink-0`}>
        {icon}
      </div>
    </div>
  );
}
