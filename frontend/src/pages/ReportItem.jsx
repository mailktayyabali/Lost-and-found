import { useState } from "react";
import { useLocation } from "react-router-dom";

export default function ReportItem() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const typeFromURL = params.get("type");
  const [type, setType] = useState(typeFromURL || "lost");

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center">
      {/* PAGE HEADER */}
      <h1 className="text-4xl font-bold text-gray-800 mt-10">Report an Item</h1>

      {/* LOST / FOUND TOGGLE */}
      <div className="mt-6 bg-gray-200 rounded-full p-1 flex w-full max-w-[320px]">
        <button
          onClick={() => setType("lost")}
          className={`flex-1 py-2 text-sm rounded-full transition ${
            type === "lost" ? "bg-white shadow font-semibold" : "text-gray-600"
          }`}
        >
          I Lost Something
        </button>

        <button
          onClick={() => setType("found")}
          className={`flex-1 py-2 text-sm rounded-full transition ${
            type === "found" ? "bg-white shadow font-semibold" : "text-gray-600"
          }`}
        >
          I Found Something
        </button>
      </div>

      {/* FORM CONTAINER */}
      <form className="w-full max-w-3xl bg-white mt-10 p-6 sm:p-10 rounded-2xl shadow-sm space-y-10 mb-20">
        {/* ABOUT THE ITEM */}
        <section>
          <h2 className="text-lg font-bold text-gray-700 border-b pb-2">
            About the Item
          </h2>

          {/* Row 1: Item Name */}
          <div className="mt-6">
            <label className="mb-1 font-medium text-gray-600">Item Name</label>
            <input
              type="text"
              placeholder="e.g., Black Leather Wallet"
              className="border p-3 rounded-lg w-full focus:ring-2 ring-blue-300"
            />
          </div>

          {/* Row 2: Category + Color */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-gray-600">Category</label>
              <select className="border p-3 rounded-lg w-full focus:ring-2 ring-blue-300">
                <option>Electronics</option>
                <option>Accessories</option>
                <option>Clothing</option>
                <option>Documents</option>
                <option>Other</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="mb-1 font-medium text-gray-600">Color</label>
              <input
                type="text"
                placeholder="e.g., Red"
                className="border p-3 rounded-lg w-full focus:ring-2 ring-blue-300"
              />
            </div>
          </div>

          {/* Row 3: Detailed Description */}
          <div className="flex flex-col mt-6">
            <label className="mb-1 font-medium text-gray-600">
              Detailed Description
            </label>
            <textarea
              rows="4"
              placeholder="Describe any distinctive features, brand, condition, or contents…"
              className="border p-3 rounded-lg w-full focus:ring-2 ring-blue-300"
            ></textarea>
          </div>

          {/* Row 4: Upload Photos */}
          <div className="flex flex-col mt-6">
            <label className="mb-1 font-medium text-gray-600">
              Upload Photos
            </label>
            <div className="border border-dashed p-8 rounded-lg text-center mt-2 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
              <i className="fa-solid fa-cloud-arrow-up text-4xl text-gray-400 mb-3"></i>
              <p className="text-gray-600">
                Drag & drop files here or{" "}
                <span className="text-blue-600 font-medium hover:underline">browse</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>
        </section>

        {/* WHERE & WHEN */}
        <section>
          <h2 className="text-lg font-bold text-gray-700 border-b pb-2">
            Where & When
          </h2>

          {/* Location */}
          <div className="mt-6">
            <label className="mb-1 font-medium text-gray-600">Location</label>
            <input
              type="text"
              placeholder="e.g., Central Park, near the fountain"
              className="border p-3 rounded-lg w-full focus:ring-2 ring-blue-300"
            />
          </div>

          {/* Date Lost/Found and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-gray-600">
                Date {type === "lost" ? "Lost" : "Found"}
              </label>
              <input
                type="date"
                className="border p-3 rounded-lg w-full focus:ring-2 ring-blue-300"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 font-medium text-gray-600">
                Approximate Time
              </label>
              <input
                type="time"
                className="border p-3 rounded-lg w-full focus:ring-2 ring-blue-300"
              />
            </div>
          </div>
        </section>

        {/* CONTACT DETAILS */}
        <section>
          <h2 className="text-lg font-bold text-gray-700 border-b pb-2">
            Your Contact Details
          </h2>

          {/* Name and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-gray-600">
                Your Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="border p-3 rounded-lg w-full focus:ring-2 ring-blue-300"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 font-medium text-gray-600">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="border p-3 rounded-lg w-full focus:ring-2 ring-blue-300"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="mt-6 flex flex-col">
            <label className="mb-1 font-medium text-gray-600">
              Phone Number{" "}
              <span className="text-gray-400 text-sm">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g., +1 234 567 890"
              className="border p-3 rounded-lg w-full focus:ring-2 ring-blue-300"
            />
          </div>

          {/* Security / Info Message */}
          <div className="mt-4 flex gap-3 items-start p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <span className="text-blue-500 text-xl flex-shrink-0">🔒</span>
            <p className="text-blue-700 text-sm">
              Your contact information will be kept private and shared only with
              a user who has a confirmed match for your item.
            </p>
          </div>
        </section>

        {/* SUBMIT BUTTONS */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
          <button 
            type="button"
            className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
          >
            Cancel
          </button>

          <button 
            type="submit"
            className="px-6 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition"
          >
            Submit Report
          </button>
        </div>
      </form>
    </div>
  );
}
