import { api } from "./api";

export const searchMovies = async (query: string) => {
  const { data } = await api.get("/search/movie", {
    params: { query },
  });
  return data;
};
