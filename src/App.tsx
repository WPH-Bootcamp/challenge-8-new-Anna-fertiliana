import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MovieDetail from "./pages/MovieDetail";
import AuthSuccess from "./pages/auth-success";
import Favorites from "./pages/favorite";
import Search from "./pages/search";

function App() {
  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/auth" element={<AuthSuccess />} />
        <Route path="/favorite" element={<Favorites />} />
        <Route path="/auth-success" element={<AuthSuccess />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </div>
  );
}

export default App;





