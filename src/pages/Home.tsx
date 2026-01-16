import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WatchTrailerButton from "../components/WatchTrailerButton";


const IMAGE_ORIGINAL = "https://image.tmdb.org/t/p/original";
const IMAGE_W300 = "https://image.tmdb.org/t/p/w300";

/* == TYPES == */

type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
};

type Trailer = {
  key: string;
};

/* == FETCHERS == */

const fetchTrendingMovies = async (): Promise<Movie[]> => {
  const { data } = await api.get("/trending/movie/week");
  return data.results;
};

const fetchNewReleaseMovies = async (): Promise<Movie[]> => {
  const { data } = await api.get("/movie/now_playing");
  return data.results;
};

const fetchTrailer = async (id: number): Promise<Trailer | undefined> => {
  const { data } = await api.get(`/movie/${id}/videos`);
  return data.results.find(
    (video: any) => video.type === "Trailer" && video.site === "YouTube"
  );
};

/* == COMPONENT == */

const Home = () => {
  const [visibleCount, setVisibleCount] = useState(15);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const { data: trendingMovies } = useQuery({
    queryKey: ["trending"],
    queryFn: fetchTrendingMovies,
  });

  const { data: newReleaseMovies } = useQuery({
    queryKey: ["new-release"],
    queryFn: fetchNewReleaseMovies,
  });

  const heroMovie = trendingMovies?.[0];

  const { data: trailer } = useQuery<Trailer | undefined>({
    queryKey: ["hero-trailer", heroMovie?.id],
    queryFn: () => fetchTrailer(heroMovie!.id),
    enabled: !!heroMovie,
  });

  return (
    <>
      <main className="text-white bg-[#0F0F0F]">
    {/* == HERO == */}
      {heroMovie && (
        <section className="relative h-[520px] overflow-hidden">
      {/* BACKGROUND */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: heroMovie.backdrop_path
              ? `url(${IMAGE_ORIGINAL}${heroMovie.backdrop_path})`
              : undefined,
            }}
          />

      {/* OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

      {/* NAVBAR */}
          <div className="relative z-50">
            <Navbar />
          </div>

      {/* CONTENT */}
          <div className="relative z-20 h-full flex items-center">
            <div className="w-full px-6 md:px-10">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold mb-4">
               {heroMovie.title}
              </h1>
              <p className="text-sm text-gray-300 mb-6 line-clamp-3">
                {heroMovie.overview}
              </p>

      {/* ACTION */}
          <div className="flex gap-4 mb-6">
              {trailer && (
              <WatchTrailerButton youtubeKey={trailer.key} />
             )}

            <button
              onClick={() => navigate(`/movie/${heroMovie.id}`)}
              className="border border-white/30
                         px-6 py-3 rounded-full
                         text-sm hover:bg-white/10"
                >
                  See Detail
            </button>
          </div>
          </div>
          </div>
          </div>

      {/* FADE */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-[#0F0F0F]" />
          </section>
        )}

        {/* == TRENDING NOW == */}
        <section className="mt-12 relative">
          <div className="max-w-7xl mx-auto px-6 md:px-10 mb-4">
            <h2 className="text-xl font-semibold">Trending Now</h2>
          </div>

        {/* ARROW LEFT */}
          <button
            onClick={() =>
              scrollRef.current?.scrollBy({ left: -500, behavior: "smooth" })
            }
            className="absolute left-2 top-1/2 -translate-y-1/2 z-30
                       w-10 h-10 rounded-md bg-black/70 hover:bg-black
                       flex items-center justify-center"
          >
            <img src="/arrow-left.svg" className="w-4 h-4" />
          </button>

        {/* ARROW RIGHT */}
          <button
            onClick={() =>
              scrollRef.current?.scrollBy({ left: 500, behavior: "smooth" })
            }
            className="absolute right-2 top-1/2 -translate-y-1/2 z-30
                       w-10 h-10 rounded-md bg-black/70 hover:bg-black
                       flex items-center justify-center"
          >
            <img src="/arrow-right.svg" className="w-4 h-4" />
          </button>

        {/* SCROLL ROW */}
          <div
            ref={scrollRef}
            className="flex gap-4 px-6 md:px-10 pb-4
                       overflow-x-auto scrollbar-hide"
          >
            {trendingMovies?.map((movie) => (
              <div
                key={movie.id}
                onClick={() => navigate(`/movie/${movie.id}`)}
                className="w-[160px] md:w-[180px] lg:w-[200px]
                           shrink-0 cursor-pointer"
              >
                <div className="rounded-2xl overflow-hidden mb-2">
                  <img
                    src={`${IMAGE_W300}${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-[280px] object-cover
                               hover:scale-105 transition"
                  />
                </div>

                <h3 className="text-sm truncate">{movie.title}</h3>

                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <img src="/star.svg" className="w-4 h-4" />
                  {movie.vote_average.toFixed(1)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* == NEW RELEASE == */}
      <section className="relative max-w-7xl mx-auto px-6 md:px-10 mt-14 pb-32">
        <h2 className="text-xl font-semibold mb-6">New Release</h2>
          <div className="relative">

        {/* MOVIE GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {newReleaseMovies?.slice(0, visibleCount).map((movie) => (
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
              className="w-full h-[260px] object-cover
                         hover:scale-105 transition"
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

        {visibleCount < (newReleaseMovies?.length ?? 0) && (
        <>
      {/* GRADIENT SHADOW */}
      <div
        className="pointer-events-none absolute bottom-0 left-0
                 w-full h-32
                 bg-gradient-to-t
                 from-[#0F0F0F]
                 via-[#0F0F0F]/70
                 to-transparent
                 z-10"
      />

      {/* SOFT BLUR LAYER */}
      <div
        className="pointer-events-none absolute bottom-0 left-0
                 w-full h-20
                 backdrop-blur-[1.5px]
                 bg-black/20
                 z-20"
      />

      {/* LOAD MORE BUTTON */}
      <div
        className="absolute bottom-14 left-1/2
                 -translate-x-1/2 z-30"
      >
        <button
          onClick={() => setVisibleCount((prev) => prev + 25)}
          className="px-10 py-3 rounded-full
                   bg-black/50 backdrop-blur-md
                   border border-white/20
                   text-sm font-medium
                   hover:bg-black/60 transition"
        >
          Load More
        </button>
      </div>
  </>
    )}

      </div>
    </section>

      </main>
      <Footer />
    </>
  );
};

export default Home;
