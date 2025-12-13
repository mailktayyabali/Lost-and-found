import { useState } from "react";

function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 lg:p-10 shadow-md border border-gray-100">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-[#243DB3]/10 rounded-lg text-[#243DB3]">
          <span className="material-symbols-outlined">mail</span>
        </div>
        <h2 className="text-xl font-heading font-bold text-[#212121]">
          Send us a message
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Field */}
          <div className="flex flex-col gap-2">
            <label
              className="text-sm font-semibold text-gray-700"
              htmlFor="name"
            >
              Full Name
            </label>
            <input
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 h-12 text-gray-900 placeholder:text-gray-400 focus:border-[#243DB3] focus:ring-2 focus:ring-[#243DB3]/20 transition-all outline-none"
              id="name"
              name="name"
              placeholder="John Doe"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email Field */}
          <div className="flex flex-col gap-2">
            <label
              className="text-sm font-semibold text-gray-700"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 h-12 text-gray-900 placeholder:text-gray-400 focus:border-[#243DB3] focus:ring-2 focus:ring-[#243DB3]/20 transition-all outline-none"
              id="email"
              name="email"
              placeholder="john@example.com"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Subject Dropdown */}
        <div className="flex flex-col gap-2">
          <label
            className="text-sm font-semibold text-gray-700"
            htmlFor="subject"
          >
            Subject
          </label>
          <div className="relative">
            <select
              className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 h-12 text-gray-900 focus:border-[#243DB3] focus:ring-2 focus:ring-[#243DB3]/20 transition-all outline-none pr-10"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            >
              <option disabled value="">
                Select a topic...
              </option>
              <option value="lost">Reporting a Lost Item</option>
              <option value="found">Reporting a Found Item</option>
              <option value="account">Account Issue</option>
              <option value="feedback">General Feedback</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
              <span className="material-symbols-outlined">expand_more</span>
            </div>
          </div>
        </div>

        {/* Message Textarea */}
        <div className="flex flex-col gap-2">
          <label
            className="text-sm font-semibold text-gray-700"
            htmlFor="message"
          >
            Message
          </label>
          <textarea
            className="w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-gray-900 placeholder:text-gray-400 focus:border-[#243DB3] focus:ring-2 focus:ring-[#243DB3]/20 transition-all outline-none resize-y min-h-[140px] custom-scrollbar"
            id="message"
            name="message"
            placeholder="Please describe your issue or question in detail..."
            rows="5"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            className="group relative w-full sm:w-auto min-w-[160px] h-12 flex items-center justify-center gap-2 bg-gradient-to-r from-[#243DB3] to-[#3D7A8C] hover:from-[#3D7A8C] hover:to-[#243DB3] text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg shadow-md"
            type="submit"
          >
            <span>Send Message</span>
            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
              send
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default ContactForm;

