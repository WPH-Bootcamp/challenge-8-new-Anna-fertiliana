import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [keyword, setKeyword] = useState("");

  /* == SCROLL EFFECT == */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* == HANDLER == */
  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    navigate(`/search?q=${keyword}`);
    setKeyword("");
    setSearchOpen(false);
  };

  return (
    <header className="relative z-50">

  {/* == TOP BAR == */}
    <div
      className={`fixed top-0 left-0 w-full transition-all duration-300
      ${scrolled ? "bg-black/30 backdrop-blur-md" : "bg-transparent"}`}
    >
    <div className="h-14 px-6 flex items-center">

  {/* LOGO */}
    <div
      onClick={() => navigate("/")}
      className="flex items-center gap-2 text-white cursor-pointer"
    >
      <img src="/bxs_tv.svg" className="w-4 h-4 opacity-70" />
      <span className="font-medium">Movie</span>
    </div>

  {/* ===== DESKTOP MENU ===== */}
    <nav className="hidden md:flex gap-8 text-sm mx-auto">
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive
          ? "text-white"
          : "text-gray-400 hover:text-white"
           }
          >
          Home
      </NavLink>

      <NavLink
        to="/favorite"
        className={({ isActive }) =>
          isActive
          ? "text-white"
          : "text-gray-400 hover:text-white"
            }
          >
          Favorites
      </NavLink>
    </nav>

  {/* == DESKTOP SEARCH == */}
    <form
      onSubmit={submitSearch}
      className="hidden md:flex items-center gap-2
                w-56 px-4 py-2 text-sm
                bg-white/10 rounded-md">
        <img src="/search.svg" className="w-4 h-4 opacity-70" />
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search movie"
          className="bg-transparent outline-none w-full
                     text-white placeholder:text-gray-400"
          />
    </form>

  {/* == MOBILE == */}
    <div className="ml-auto flex items-center gap-4 md:hidden">
      <button 
        onClick={() => setSearchOpen(true)}>
        <img src="/search.svg" className="w-5 h-5 opacity-80" />
      </button>

      <button
        onClick={() => setMenuOpen(true)}
        className="text-white text-2xl">
          ☰
      </button>
    </div>
    </div>
    </div>

    {/* spacer */}
      <div className="h-14" />

  {/* == MOBILE MENU == */}
    {menuOpen && (
      <div className="fixed inset-0 bg-black z-[999] px-6 pt-20">
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-6 right-6 text-white text-2xl"
        >
          ✕
        </button>

        <nav className="space-y-8 text-lg text-white">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block"
            >
              Home
          </Link>

          <Link
            to="/favorite"
            onClick={() => setMenuOpen(false)}
            className="block"
            >
              Favorites
          </Link>
        </nav>
      </div>
    )}

  {/* == MOBILE SEARCH == */}
    {searchOpen && (
      <div className="fixed inset-0 z-[999] bg-black px-6 pt-20">
        <button
          onClick={() => setSearchOpen(false)}
          className="absolute top-6 right-6 text-white text-2xl"
        >
          ✕
        </button>

        <form onSubmit={submitSearch}>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10">
            <img src="/search.svg" className="w-5 h-5 opacity-70" />
            <input
              autoFocus
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search movie"
              className="bg-transparent outline-none w-full
                         text-white placeholder:text-gray-400"
            />
          </div>
        </form>
        </div>
      )}
    </header>
  );
};

export default Navbar;
