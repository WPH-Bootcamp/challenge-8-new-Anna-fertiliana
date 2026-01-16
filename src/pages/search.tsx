import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { searchMovies } from "../lib/movie";

const IMAGE_W300 = "https://image.tmdb.org/t/p/w300";

const Search = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const query = params.get("q") || "";

  const { data, isLoading } = useQuery({
    queryKey: ["search", query],
    queryFn: () => searchMovies(query),
    enabled: !!query,
  });

  const movies = data?.results || [];

  return (
    <>
      <Navbar />

      <main className="min-h-[70vh] max-w-7xl mx-auto px-6 md:px-10 py-20">
        {/* TITLE */}
        <h1 className="text-xl font-semibold mb-8">
          Search Result for “{query}”
        </h1>

        {/* LOADING */}
        {isLoading && (
          <p className="text-gray-400 text-sm">Searching movies...</p>
        )}

        {/* EMPTY */}
        {!isLoading && movies.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center mt-24">
            <img
              src="/slate.svg"
              className="w-24 mb-6 opacity-80"
            />
            <h2 className="text-lg font-semibold mb-2">Data Not Found</h2>
            <p className="text-gray-400 text-sm">
              Try other keywords
            </p>
          </div>
        )}

        {/* RESULT */}
        {movies.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {movies.map((movie: any) => (
              <div
                key={movie.id}
                onClick={() => navigate(`/movie/${movie.id}`)}
                className="cursor-pointer"
              >
                <div className="rounded-2xl overflow-hidden mb-2">
                  <img
                    src={
                      movie.poster_path
                        ? `${IMAGE_W300}${movie.poster_path}`
                        : "/placeholder.png"
                    }
                    alt={movie.title}
                    className="w-full h-[260px] object-cover hover:scale-105 transition"
                  />
                </div>

                <h3 className="text-sm font-medium truncate">
                  {movie.title}
                </h3>

                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <img src="/star.svg" className="w-4 h-4" />
                  {movie.vote_average.toFixed(1)}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
};

export default Search;
