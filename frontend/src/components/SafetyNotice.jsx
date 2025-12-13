function SafetyNotice() {
  return (
    <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 flex gap-3 items-start">
      <span className="material-symbols-outlined text-[#243DB3] shrink-0 mt-0.5">
        security
      </span>
      <div>
        <h4 className="text-sm font-bold text-[#243DB3] mb-1">Stay Safe</h4>
        <p className="text-xs text-blue-900/70 leading-relaxed">
          Always meet in a public place like a police station or busy cafe. Never share
          personal financial details.
        </p>
      </div>
    </div>
  );
}

export default SafetyNotice;

