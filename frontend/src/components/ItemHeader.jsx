import FavoriteButton from "./FavoriteButton";

function ItemHeader({ status, title, itemId, actionButtons }) {
  const isFound = status === "FOUND";

  return (
    <div className="flex items-start justify-between gap-4 mb-3">
      <div className="flex flex-col gap-1">
        <div
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider w-fit mb-2 border ${isFound
            ? "bg-[#4CAF50]/10 text-[#4CAF50] border-[#4CAF50]/20"
            : "bg-[#F44336]/10 text-[#F44336] border-[#F44336]/20"
            }`}
        >
          <span className="material-symbols-outlined text-sm mr-1">
            {isFound ? "check_circle" : "error"}
          </span>
          {status}
        </div>
        <h1 className="text-3xl font-heading font-bold text-[#212121] leading-tight">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <FavoriteButton itemId={itemId} size="default" />
        {actionButtons}
      </div>
    </div>
  );
}

export default ItemHeader;

