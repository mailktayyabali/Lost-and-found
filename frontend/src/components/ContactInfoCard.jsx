function ContactInfoCard({ icon, title, description, contact, link, iconBg, iconColor }) {
  return (
    <div className="group flex items-start gap-4 p-5 bg-white border border-gray-200 rounded-2xl hover:border-[#243DB3]/50 transition-colors">
      <div
        className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center ${iconColor} shrink-0 group-hover:scale-110 transition-transform`}
      >
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <h3 className="font-bold text-[#212121] mb-1">{title}</h3>
        <p className="text-sm text-gray-500 mb-2">{description}</p>
        {link ? (
          <a
            className="text-[#243DB3] font-medium text-sm hover:underline"
            href={link}
          >
            {contact}
          </a>
        ) : (
          <button className="text-[#243DB3] font-medium text-sm hover:underline">
            {contact}
          </button>
        )}
      </div>
    </div>
  );
}

export default ContactInfoCard;

