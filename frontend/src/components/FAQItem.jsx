import { useState } from "react";

function FAQItem({ question, answer, icon }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <details
      className={`group bg-white rounded-xl border border-gray-200 overflow-hidden ${
        isOpen ? "border-[#243DB3]/50" : ""
      }`}
      open={isOpen}
      onToggle={(e) => setIsOpen(e.target.open)}
    >
      <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-6 text-[#212121] font-semibold transition hover:bg-gray-50">
        <span className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#243DB3]">{icon}</span>
          {question}
        </span>
        <span
          className={`material-symbols-outlined transition duration-300 text-gray-500 ${
            isOpen ? "-rotate-180" : ""
          }`}
        >
          expand_more
        </span>
      </summary>
      <div className="px-6 pb-6 pt-0 text-gray-600 leading-relaxed ml-9">
        <p>{answer}</p>
      </div>
    </details>
  );
}

export default FAQItem;

