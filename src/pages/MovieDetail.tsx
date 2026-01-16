import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WatchTrailerButton from "../components/WatchTrailerButton";
import FavoriteButton from "../components/FavoriteButton";
import Icon from "../components/Icon";
import ToastSuccess from "../components/ToastSuccess";

const IMAGE_ORIGINAL = "https://image.tmdb.org/t/p/original";
const IMAGE_W500 = "https://image.tmdb.org/t/p/w500";
const IMAGE_W185 = "https://image.tmdb.org/t/p/w185";

/* ================= TYPES ================= */

type Genre = {
  id: number;
  name: string;
};

type MovieDetailType = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  runtime: number;
  adult: boolean;
  genres: Genre[];
};

type Cast = {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
};

type Trailer = {
  key: string;
};

/* ================= FETCHERS ================= */

const fetchMovieDetail = async (id: string): Promise<MovieDetailType> => {
  const { data } = await api.get(`/movie/${id}`);
  return data;
};

const fetchCredits = async (id: string): Promise<Cast[]> => {
  const { data } = await api.get(`/movie/${id}/credits`);
  return data.cast.slice(0, 6);
};

const fetchTrailer = async (id: string): Promise<Trailer | undefined> => {
  const { data } = await api.get(`/movie/${id}/videos`);
  return data.results.find(
    (video: any) => video.type === "Trailer" && video.site === "YouTube"
  );
};

/* ================= COMPONENT ================= */

const MovieDetail = () => {
  const { id } = useParams();
  const [showToast, setShowToast] = useState(false);

  const { data: movie } = useQuery({
    queryKey: ["movie-detail", id],
    queryFn: () => fetchMovieDetail(id!),
    enabled: !!id,
  });

  const { data: cast } = useQuery({
    queryKey: ["movie-credits", id],
    queryFn: () => fetchCredits(id!),
    enabled: !!id,
  });

  const { data: trailer } = useQuery({
    queryKey: ["movie-trailer", id],
    queryFn: () => fetchTrailer(id!),
    enabled: !!id,
  });

  if (!movie) return null;

  return (
    <>
      {/* TOAST */}
      <ToastSuccess
        show={showToast}
        message="Success add to favorites"
      />

      {/* HERO */}
      <section className="relative h-[560px] text-white overflow-hidden">
        {/* BACKDROP */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: movie.backdrop_path
              ? `url(${IMAGE_ORIGINAL}${movie.backdrop_path})`
              : undefined,
          }}
        />
        <div className="absolute inset-0 bg-black/60" />

        {/* NAVBAR */}
        <div className="relative z-50">
          <Navbar />
        </div>

        {/* CONTENT */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-10 h-full flex items-center">
          <div className="flex flex-col md:flex-row gap-10">
            {/* POSTER */}
            <img
              src={
                movie.poster_path
                  ? `${IMAGE_W500}${movie.poster_path}`
                  : "/placeholder.png"
              }
              className="w-[220px] md:w-[260px] rounded-xl shadow-lg"
            />

            {/* INFO */}
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold mb-2">
                {movie.title}
              </h1>

              <p className="text-sm text-gray-300 mb-6">
                {new Date(movie.release_date).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>

              {/* ACTION */}
              <div className="flex gap-4 mb-6">
                {trailer && (
                  <WatchTrailerButton youtubeKey={trailer.key} />
                )}

                <FavoriteButton
                  movieId={movie.id}
                  onSuccess={() => {
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 2000);
                  }}
                />
              </div>

              {/* INFO BOX */}
              <div className="grid grid-cols-3 gap-4 max-w-md">
                <div className="bg-black/60 rounded-xl p-4 text-center">
                  <Icon name="star.svg" className="w-5 h-5 mx-auto" />
                  <p className="text-xs text-gray-400">Rating</p>
                  <p className="font-semibold">
                    {movie.vote_average.toFixed(1)}/10
                  </p>
                </div>

                <div className="bg-black/60 rounded-xl p-4 text-center">
                  <Icon name="video.svg" className="w-5 h-5 mx-auto" />
                  <p className="text-xs text-gray-400">Genre</p>
                  <p className="font-semibold">
                    {movie.genres[0]?.name ?? "-"}
                  </p>
                </div>

                <div className="bg-black/60 rounded-xl p-4 text-center">
                  <Icon name="emoji-happy.svg" className="w-5 h-5 mx-auto" />
                  <p className="text-xs text-gray-400">Age Limit</p>
                  <p className="font-semibold">
                    {movie.adult ? "18+" : "13+"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-b from-transparent to-[#0F0F0F]" />
      </section>

      {/* OVERVIEW */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 mt-16">
        <h2 className="text-xl font-semibold mb-4">Overview</h2>
        <p className="text-gray-300 max-w-3xl leading-relaxed">
          {movie.overview}
        </p>
      </section>

      {/* CAST */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 mt-16 pb-32">
        <h2 className="text-xl font-semibold mb-6">Cast & Crew</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {cast?.map((actor) => (
            <div key={actor.id} className="flex items-center gap-4">
              <img
                src={
                  actor.profile_path
                    ? `${IMAGE_W185}${actor.profile_path}`
                    : "/avatar.png"
                }
                className="w-14 h-14 rounded-lg object-cover"
              />
              <div>
                <p className="font-medium">{actor.name}</p>
                <p className="text-xs text-gray-400">
                  {actor.character}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default MovieDetail;
