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
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="card-minimal p-8 lg:p-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-teal/10 rounded-lg text-teal">
          <span className="material-symbols-outlined">email</span>
        </div>
        <h2 className="text-xl font-bold text-navy">
          Send us a message
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Field */}
          <div className="flex flex-col gap-2">
            <label
              className="text-sm font-semibold text-navy"
              htmlFor="name"
            >
              Full Name
            </label>
            <input
              className="input-minimal"
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
              className="text-sm font-semibold text-navy"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              className="input-minimal"
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
            className="text-sm font-semibold text-navy"
            htmlFor="subject"
          >
            Subject
          </label>
          <div className="relative">
            <select
              className="input-minimal w-full appearance-none pr-10"
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
            className="text-sm font-semibold text-navy"
            htmlFor="message"
          >
            Message
          </label>
          <textarea
            className="input-minimal resize-y min-h-[140px] custom-scrollbar"
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
            className="btn-primary group flex items-center gap-2 px-6 py-3 w-full sm:w-auto"
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
