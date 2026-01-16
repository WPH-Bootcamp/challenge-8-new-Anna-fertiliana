import { useEffect, useState } from "react";
import Icon from "./Icon";
import { addFavorite, getFavoriteStatus } from "../lib/favorite";
import { requestToken } from "../lib/auth";

type Props = {
  movieId: number;
  onSuccess?: () => void;
};

const FavoriteButton = ({ movieId, onSuccess }: Props) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const sessionId = localStorage.getItem("session_id");

useEffect(() => {
  if (!sessionId) return;

  const checkFavorite = async () => {
    const status = await getFavoriteStatus(movieId);
    setIsFavorite(status);
    };
    checkFavorite();
    }, 
    [movieId, sessionId]);
  const handleFavorite = async () => {
  
  if (!sessionId) {
    const token = await requestToken();

    window.location.href =
      `https://www.themoviedb.org/authenticate/${token}?redirect_to=http://localhost:5173/auth`;
      return;
    }

    // toggle favorite via API
    await addFavorite(movieId, !isFavorite);
    setIsFavorite(!isFavorite);

    if (!isFavorite) {
      onSuccess?.(); // toast success
    }
  };

  return (
    <button
      onClick={handleFavorite}
      className={`w-12 h-12 rounded-full border
        flex items-center justify-center transition
        ${isFavorite
            ? "border-red-500 bg-red-500/10"
            : "border-white/30 hover:bg-white/10" }`}
    >
      <Icon
        name={isFavorite ? "heart-filled.svg" : "heart-outline.svg"}
        className={`w-6 h-6 transition-transform hover:scale-110
        ${isFavorite ? "text-red-500" : ""}`}
      />
    </button>
  );
};

export default FavoriteButton;
