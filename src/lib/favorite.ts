import { api } from "./api";

// ✅ ADD / REMOVE FAVORITE (toggle)
export const addFavorite = async (
  movieId: number,
  favorite: boolean
) => {
  const sessionId = localStorage.getItem("session_id");
  const accountId = localStorage.getItem("account_id");

  if (!sessionId || !accountId) {
    throw new Error("Not authenticated");
  }

  return api.post(
    `/account/${accountId}/favorite`,
    {
      media_type: "movie",
      media_id: movieId,
      favorite,
    },
    {
      params: { session_id: sessionId },
    }
  );
};

// ✅ CHECK FAVORITE STATUS
export const getFavoriteStatus = async (movieId: number) => {
  const sessionId = localStorage.getItem("session_id");

  if (!sessionId) return false;

  const res = await api.get(
    `/movie/${movieId}/account_states`,
    {
      params: { session_id: sessionId },
    }
  );

  return res.data.favorite;
};

export const getFavoriteMovies = async () => {
  const sessionId = localStorage.getItem("session_id");
  const accountId = localStorage.getItem("account_id");

  if (!sessionId || !accountId) {
    throw new Error("Not authenticated");
  }

  const { data } = await api.get(
    `/account/${accountId}/favorite/movies`,
    {
      params: { session_id: sessionId },
    }
  );

  return data.results;
};
