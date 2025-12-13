function ItemDescription({ description, className = "" }) {
  if (!description) return null;

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 ${className}`}>
      <h3 className="text-lg font-heading font-bold mb-4 text-[#212121]">
        Description
      </h3>
      <div className="text-gray-600 leading-relaxed whitespace-pre-line">
        {description}
      </div>
    </div>
  );
}

export default ItemDescription;

