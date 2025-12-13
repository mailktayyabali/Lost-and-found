function ItemMap({ mapLocation, mapImage }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
        <span className="material-symbols-outlined text-gray-400">map</span>
        Approximate Location
      </h3>
      <div className="w-full h-48 rounded-xl bg-gray-200 relative overflow-hidden group cursor-pointer">
        {mapImage && (
          <div
            className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-80"
            style={{ backgroundImage: `url('${mapImage}')` }}
          ></div>
        )}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <div className="size-12 bg-white rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-[#243DB3]">location_on</span>
          </div>
        </div>
        {mapLocation && (
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-md text-xs font-medium shadow-sm">
            {mapLocation}
          </div>
        )}
      </div>
      <button className="w-full mt-3 text-[#243DB3] text-sm font-semibold hover:underline text-center">
        View on Google Maps
      </button>
    </div>
  );
}

export default ItemMap;

