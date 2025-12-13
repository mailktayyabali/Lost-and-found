function ItemDetailsCard({ date, category, location }) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="p-3 rounded-lg bg-[#f9fafb] border border-[#f3f4f6]">
        <div className="flex items-center gap-2 text-gray-500 mb-1">
          <span className="material-symbols-outlined text-[18px]">calendar_today</span>
          <span className="text-xs font-medium uppercase tracking-wide">
            {date.includes("Lost") || date.includes("Found") ? "Date" : "Date"}
          </span>
        </div>
        <p className="text-[#212121] font-semibold">{date}</p>
      </div>

      <div className="p-3 rounded-lg bg-[#f9fafb] border border-[#f3f4f6]">
        <div className="flex items-center gap-2 text-gray-500 mb-1">
          <span className="material-symbols-outlined text-[18px]">category</span>
          <span className="text-xs font-medium uppercase tracking-wide">Category</span>
        </div>
        <p className="text-[#212121] font-semibold">{category || "General"}</p>
      </div>

      <div className="p-3 rounded-lg bg-[#f9fafb] border border-[#f3f4f6] col-span-2">
        <div className="flex items-center gap-2 text-gray-500 mb-1">
          <span className="material-symbols-outlined text-[18px]">location_on</span>
          <span className="text-xs font-medium uppercase tracking-wide">Location</span>
        </div>
        <p className="text-[#212121] font-semibold">{location}</p>
      </div>
    </div>
  );
}

export default ItemDetailsCard;

