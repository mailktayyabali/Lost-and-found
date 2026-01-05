function SocialButtons() {
  return (
    <div className="flex gap-3 mt-2 flex-col sm:flex-row">
      <button className="flex-1 flex items-center justify-center gap-2 py-2 border rounded-md bg-white text-gray-700 font-semibold hover:bg-gray-100 transition transform hover:-translate-y-1 shadow-sm">
        <i className="fa-brands fa-google text-red-500 text-base"></i>
        Google
      </button>
    </div>
  );
}

export default SocialButtons;
