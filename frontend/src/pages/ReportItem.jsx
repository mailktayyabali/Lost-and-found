import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ReportItem() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const typeFromURL = params.get("type");
  const [type, setType] = useState(typeFromURL || "lost");

  const [formData, setFormData] = useState({
    itemName: "",
    category: "Electronics",
    color: "",
    description: "",
    location: "",
    date: "",
    time: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`${type === "lost" ? "Lost" : "Found"} item report submitted! (Demo only)`);
    console.log("Report Data:", { type, ...formData });
    // Reset form
    setFormData({
      itemName: "",
      category: "Electronics",
      color: "",
      description: "",
      location: "",
      date: "",
      time: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
    });
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center px-4 py-10">
      {/* PAGE HEADER */}
      <h1 className="text-4xl font-bold text-navy mb-2">Report an Item</h1>
      <p className="text-slate mb-8">Help reunite lost items with their owners</p>

      {/* LOST / FOUND TOGGLE */}
      <div className="bg-gray-200 rounded-full p-1 flex w-full max-w-[320px] mb-8">
        <button
          type="button"
          onClick={() => setType("lost")}
          className={`flex-1 py-2.5 text-sm rounded-full transition-all font-medium ${type === "lost" ? "bg-white text-navy shadow-md" : "text-gray-600 hover:text-navy"
            }`}
        >
          I Lost Something
        </button>

        <button
          type="button"
          onClick={() => setType("found")}
          className={`flex-1 py-2.5 text-sm rounded-full transition-all font-medium ${type === "found" ? "bg-white text-navy shadow-md" : "text-gray-600 hover:text-navy"
            }`}
        >
          I Found Something
        </button>
      </div>

      {/* FORM CONTAINER */}
      <form onSubmit={handleSubmit} className="w-full max-w-3xl card-minimal p-8 space-y-10 mb-20">
        {/* ABOUT THE ITEM */}
        <section>
          <h2 className="text-lg font-bold text-navy border-b border-gray-200 pb-3 mb-6">
            About the Item
          </h2>

          {/* Item Name */}
          <div className="mb-5">
            <label className="block mb-2 font-medium text-navy text-sm">Item Name</label>
            <input
              type="text"
              name="itemName"
              placeholder="e.g., Black Leather Wallet"
              value={formData.itemName}
              onChange={handleChange}
              required
              className="input-minimal w-full"
            />
          </div>

          {/* Category + Color */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block mb-2 font-medium text-navy text-sm">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="input-minimal w-full"
              >
                <option>Electronics</option>
                <option>Accessories</option>
                <option>Clothing</option>
                <option>Documents</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium text-navy text-sm">Color</label>
              <input
                type="text"
                name="color"
                placeholder="e.g., Red"
                value={formData.color}
                onChange={handleChange}
                className="input-minimal w-full"
              />
            </div>
          </div>

          {/* Detailed Description */}
          <div className="mb-5">
            <label className="block mb-2 font-medium text-navy text-sm">
              Detailed Description
            </label>
            <textarea
              name="description"
              rows="4"
              placeholder="Describe any distinctive features, brand, condition, or contents..."
              value={formData.description}
              onChange={handleChange}
              required
              className="input-minimal w-full custom-scrollbar"
            ></textarea>
          </div>

          {/* Upload Photos */}
          <div>
            <label className="block mb-2 font-medium text-navy text-sm">
              Upload Photos
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 hover:border-teal transition-all cursor-pointer">
              <i className="fa-solid fa-cloud-arrow-up text-4xl text-gray-400 mb-3"></i>
              <p className="text-gray-600 text-sm">
                Drag & drop files here or{" "}
                <span className="text-teal font-medium hover:underline">browse</span>
              </p>
              <p className="text-xs text-gray-400 mt-2">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>
        </section>

        {/* WHERE & WHEN */}
        <section>
          <h2 className="text-lg font-bold text-navy border-b border-gray-200 pb-3 mb-6">
            Where & When
          </h2>

          {/* Location */}
          <div className="mb-5">
            <label className="block mb-2 font-medium text-navy text-sm">Location</label>
            <input
              type="text"
              name="location"
              placeholder="e.g., Central Park, near the fountain"
              value={formData.location}
              onChange={handleChange}
              required
              className="input-minimal w-full"
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block mb-2 font-medium text-navy text-sm">
                Date {type === "lost" ? "Lost" : "Found"}
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="input-minimal w-full"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-navy text-sm">
                Approximate Time
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="input-minimal w-full"
              />
            </div>
          </div>
        </section>

        {/* CONTACT DETAILS */}
        <section>
          <h2 className="text-lg font-bold text-navy border-b border-gray-200 pb-3 mb-6">
            Your Contact Details
          </h2>

          {/* Name and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block mb-2 font-medium text-navy text-sm">
                Your Name
              </label>
              <input
                type="text"
                name="contactName"
                placeholder="John Doe"
                value={formData.contactName}
                onChange={handleChange}
                required
                className="input-minimal w-full"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-navy text-sm">
                Email Address
              </label>
              <input
                type="email"
                name="contactEmail"
                placeholder="you@example.com"
                value={formData.contactEmail}
                onChange={handleChange}
                required
                className="input-minimal w-full"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="mb-5">
            <label className="block mb-2 font-medium text-navy text-sm">
              Phone Number <span className="text-gray-400 text-sm">(optional)</span>
            </label>
            <input
              type="text"
              name="contactPhone"
              placeholder="e.g., +1 234 567 890"
              value={formData.contactPhone}
              onChange={handleChange}
              className="input-minimal w-full"
            />
          </div>

          {/* Security / Info Message */}
          <div className="flex gap-3 items-start p-4 bg-teal/10 border border-teal/30 rounded-lg">
            <span className="text-teal text-xl flex-shrink-0">🔒</span>
            <p className="text-navy text-sm">
              Your contact information will be kept private and shared only with
              a user who has a confirmed match for your item.
            </p>
          </div>
        </section>

        {/* SUBMIT BUTTONS */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="btn-secondary px-6 py-2.5"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn-primary px-6 py-2.5"
          >
            Submit Report
          </button>
        </div>
      </form>
    </div>
  );
}
