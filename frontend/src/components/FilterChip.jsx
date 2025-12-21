function FilterChip({ label, value, onRemove }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal/10 text-teal rounded-full text-sm font-medium border border-teal/20">
      <span>{label}: {value}</span>
      <button
        onClick={onRemove}
        className="hover:bg-teal/20 rounded-full p-0.5 transition-colors"
        aria-label={`Remove ${label} filter`}
      >
        <i className="fa-solid fa-times text-xs"></i>
      </button>
    </div>
  );
}

export default FilterChip;

