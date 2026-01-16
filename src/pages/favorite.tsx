import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { api } from "../lib/api";
import { getFavoriteMovies, addFavorite } from "../lib/favorite";

const IMAGE_W185 = "https://image.tmdb.org/t/p/w185";

/* == FETCH TRAILER == */

const fetchTrailer = async (id: number) => {
  const { data } = await api.get(`/movie/${id}/videos`);
  return data.results.find(
    (video: any) => video.type === "Trailer" && video.site === "YouTube"
  );
};

/* == ITEM COMPONENT == */

const FavoriteItem = ({
  movie,
  onRemove,
}: {
  movie: any;
  onRemove: (id: number) => void;
}) => {
  const { data: trailer } = useQuery({
    queryKey: ["favorite-trailer", movie.id],
    queryFn: () => fetchTrailer(movie.id),
  });

  return (
    <div className="flex items-center gap-6 pb-8 border-b border-white/10">
    {/* POSTER */}
      <img
        src={
          movie.poster_path
            ? `${IMAGE_W185}${movie.poster_path}`
            : "/placeholder.png"
        }
        alt={movie.title}
        className="w-24 rounded-lg"
      />

    {/* INFO */}
      <div className="flex-1">
        <h3 className="font-semibold mb-3">{movie.title}</h3>

        {trailer && (
          <a
            href={`https://www.youtube.com/watch?v=${trailer.key}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-[#E50914] hover:bg-red-700
                       px-6 py-2 rounded-full
                       text-xs font-semibold
                       flex items-center gap-2 w-fit"
          >
            Watch Trailer
            <img
              src="/play.svg"
              className="w-3 h-3 transition-transform
                         group-hover:translate-x-0.5"
            />
          </a>
        )}
      </div>

      {/* FAVORITE BUTTON */}
      <button
        onClick={() => onRemove(movie.id)}
        className="w-10 h-10 rounded-full
                   border border-white/20
                   flex items-center justify-center
                   hover:bg-white/10 transition"
        title="Remove from favorite"
      >
        <img src="/heart-filled.svg" className="w-5 h-5" />
      </button>
    </div>
  );
};

/* == PAGE == */

const Favorites = () => {
  const queryClient = useQueryClient();

  const { data: movies = [], isLoading } = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavoriteMovies,
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: (movieId: number) => addFavorite(movieId, false),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  if (isLoading) return null;

  const isEmpty = movies.length === 0;

  return (
    <>
      <Navbar />

      <main className="min-h-[70vh] max-w-7xl mx-auto px-6 md:px-10 py-16">
        <h1 className="text-2xl font-semibold mb-10">Favorites</h1>

      {/* EMPTY STATE */}
        {isEmpty && (
          <div className="flex flex-col items-center justify-center text-center mt-24">
            <img
              src="/clapboard.svg"
              alt="Empty Favorite"
              className="w-24 mb-6 opacity-80"
            />
            <h2 className="text-lg font-semibold mb-2">Data Empty</h2>
            <p className="text-gray-400 text-sm mb-6">
              You don’t have a favorite movie yet.
            </p>

            <Link
              to="/"
              className="px-8 py-3 bg-[#E50914] hover:bg-red-700
                         rounded-full text-sm font-medium transition"
            >
              Explore Movie
            </Link>
          </div>
        )}

      {/* FAVORITE LIST */}
        {!isEmpty && (
          <div className="space-y-8">
            {movies.map((movie: any) => (
              <FavoriteItem
                key={movie.id}
                movie={movie}
                onRemove={(id) => removeFavoriteMutation.mutate(id)}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
};

export default Favorites;
