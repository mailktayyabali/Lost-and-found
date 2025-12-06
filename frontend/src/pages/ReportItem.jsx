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
      <h1 className="text-4xl font-bold text-gray-800 mt-10">
        Report an Item
      </h1>

      {/* LOST / FOUND TOGGLE */}
      <div className="mt-6 bg-gray-200 rounded-full p-1 flex w-[320px]">
        <button
          onClick={() => setType("lost")}
          className={`flex-1 py-2 text-sm rounded-full transition 
          ${type === "lost" ? "bg-white shadow font-semibold" : "text-gray-600"}`}
        >
          I Lost Something
        </button>

        <button
          onClick={() => setType("found")}
          className={`flex-1 py-2 text-sm rounded-full transition
          ${type === "found" ? "bg-white shadow font-semibold" : "text-gray-600"}`}
        >
          I Found Something
        </button>
      </div>

      {/* FORM CONTAINER */}
      <form className="w-full max-w-3xl bg-white mt-10 p-10 rounded-2xl shadow-sm space-y-10 mb-20">

        {/* ABOUT THE ITEM */}
        <section>
          <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
            About the Item
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <input
              type="text"
              placeholder="e.g., Black Leather Wallet"
              className="border p-3 rounded-lg w-full focus:ring-2 ring-blue-300"
            />

            <select className="border p-3 rounded-lg w-full focus:ring-2 ring-blue-300">
              <option>Electronics</option>
              <option>Accessories</option>
              <option>Clothing</option>
              <option>Documents</option>
              <option>Other</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <input
              type="text"
              placeholder="e.g., Red"
              className="border p-3 rounded-lg w-full focus:ring-2 ring-blue-300"
            />
          </div>

          <textarea
            rows="4"
            placeholder="Describe any distinctive features, brand, condition, or contents…"
            className="border p-3 rounded-lg w-full focus:ring-2 ring-blue-300 mt-6"
          ></textarea>

          {/* Upload Box */}
          <div className="border border-dashed p-8 rounded-lg text-center mt-6 bg-gray-50">
            <img 
              src="/upload-icon.png" 
              alt="upload" 
              className="mx-auto opacity-50 w-10 mb-2"
            />
            <p className="text-gray-600">
              Drag & drop files here or <span className="text-blue-600 cursor-pointer">browse</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
          </div>
        </section>

        {/* WHERE & WHEN */}
        <section>
          <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
            Where & When
          </h2>

          <input
            type="text"
            placeholder="e.g., Central Park, near the fountain"
            className="border p-3 rounded-lg w-full focus:ring-2 ring-blue-300 mt-6"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <input
              type="date"
              className="border p-3 rounded-lg w-full focus:ring-2 ring-blue-300"
            />
            <input
              type="time"
              className="border p-3 rounded-lg w-full focus:ring-2 ring-blue-300"
            />
          </div>
        </section>

        {/* CONTACT DETAILS */}
        <section>
          <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
            Your Contact Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <input
              type="text"
              placeholder="John Doe"
              className="border p-3 rounded-lg w-full focus:ring-2 ring-blue-300"
            />

            <input
              type="email"
              placeholder="you@example.com"
              className="border p-3 rounded-lg w-full focus:ring-2 ring-blue-300"
            />
          </div>

          <input
            type="text"
            placeholder="Phone Number"
            className="border p-3 rounded-lg w-full focus:ring-2 ring-blue-300 mt-6"
          />

          <div className="mt-2 text-sm text-gray-500 flex gap-2 items-start">
            <span>ℹ️</span>
            <p>Your contact information will be kept private and shared only with a user who has a confirmed match for your item.</p>
          </div>
        </section>

        {/* SUBMIT BUTTONS */}
        <div className="flex justify-end gap-4 pt-4">
          <button className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition">
            Cancel
          </button>

          <button className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
            Submit Report
          </button>
        </div>

      </form>
    </div>
  );
}
