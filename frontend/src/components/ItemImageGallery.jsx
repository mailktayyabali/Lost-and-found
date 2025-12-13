import { useState } from "react";

function ItemImageGallery({ mainImage, additionalImages = [] }) {
  const [selectedImage, setSelectedImage] = useState(mainImage);
  const allImages = [mainImage, ...additionalImages];

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 shadow-sm relative group">
        <div
          className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url('${selectedImage}')` }}
        ></div>
        <button
          className="absolute bottom-4 right-4 bg-white/90 backdrop-blur rounded-lg p-2 shadow-lg hover:bg-white transition-colors"
          title="Expand Image"
        >
          <span className="material-symbols-outlined text-gray-700">fullscreen</span>
        </button>
      </div>

      {/* Thumbnails Carousel */}
      {allImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(image)}
              className={`shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-colors relative ${
                selectedImage === image
                  ? "border-[#f2b90d] shadow-sm"
                  : "border-transparent hover:border-gray-300 opacity-70 hover:opacity-100"
              }`}
            >
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url('${image}')` }}
              ></div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ItemImageGallery;

