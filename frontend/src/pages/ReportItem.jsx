import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { itemsApi } from "../services/itemsApi";
import { getErrorMessage } from "../utils/errorHandler";
import { CATEGORIES } from "../utils/constants";

export default function ReportItem() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const params = new URLSearchParams(location.search);
  const typeFromURL = params.get("type");
  const [type, setType] = useState(typeFromURL || "lost");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

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
    if (error) setError("");
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles(files);
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check authentication
    if (!user) {
      setError("Please sign in to report an item");
      navigate("/auth");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Combine date and time into ISO string
      let dateTime = formData.date;
      if (formData.time) {
        dateTime = `${formData.date}T${formData.time}:00`;
      } else {
        dateTime = `${formData.date}T00:00:00`;
      }

      // Create FormData for multipart/form-data
      const formDataToSend = new FormData();
      formDataToSend.append("status", type.toUpperCase());
      formDataToSend.append("title", formData.itemName);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("date", new Date(dateTime).toISOString());
      formDataToSend.append("contactName", formData.contactName);
      formDataToSend.append("contactEmail", formData.contactEmail);

      // Add images
      selectedFiles.forEach((file) => {
        formDataToSend.append("images", file);
      });

      console.log('ReportItem: Submitting form data', {
        entries: Array.from(formDataToSend.entries()).map(([key, value]) => [key, value instanceof File ? value.name : value])
      });

      const response = await itemsApi.createItem(formDataToSend);
      console.log('ReportItem: API Response', response);

      if (response.success) {
        // Redirect to item detail page
        const itemId = response.data?.item?.id || response.data?.id;
        navigate(`/item/${itemId}`);
      } else {
        console.error('ReportItem: Submission failed', response);
        setError(response.message || "Failed to submit report");
      }
    } catch (err) {
      console.error('ReportItem: Submission error', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
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
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
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
              Upload Photos (Optional)
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="image/*"
              className="hidden"
            />
            <div
              onClick={handleFileClick}
              onDrop={handleFileDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 hover:border-teal transition-all cursor-pointer"
            >
              <i className="fa-solid fa-cloud-arrow-up text-4xl text-gray-400 mb-3"></i>
              <p className="text-gray-600 text-sm">
                Drag & drop files here or{" "}
                <span className="text-teal font-medium hover:underline">browse</span>
              </p>
              <p className="text-xs text-gray-400 mt-2">
                PNG, JPG, GIF up to 10MB
              </p>
              {selectedFiles.length > 0 && (
                <p className="text-sm text-teal mt-2">
                  {selectedFiles.length} file(s) selected
                </p>
              )}
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

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* SUBMIT BUTTONS */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="btn-secondary px-6 py-2.5 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-6 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center">
                <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                Submitting...
              </span>
            ) : (
              "Submit Report"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
