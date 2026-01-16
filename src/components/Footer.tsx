const Footer = () => {
  return (
    <footer className="bg-[#0F0F0F]">
        {/* TOP LINE */}
        <div className="border-t border-white/10" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-6">
        <div className="flex flex-row items-center justify-between text-xs text-gray-500">

        {/* LEFT */}
        <div className="flex items-center gap-2">
            <img
            src="/public/bxs_tv.svg"
            alt="Movie"
            className="w-4 h-4 opacity-70"
            />
            <span>Movie</span>
          </div>

        {/* RIGHT */}
          <span className="text-[10px] text-gray-600 whitespace-nowrap">
            Copyright © 2026 Movie Explorer
          </span>

        </div>
      </div>
    </footer>
  );
};

export default Footer;