type Props = {
  youtubeKey: string;
  label?: string;
};

const WatchTrailerButton = ({
  youtubeKey,
  label = "Watch Trailer",
}: Props) => {
  return (
    <a
      href={`https://www.youtube.com/watch?v=${youtubeKey}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-[#E50914] hover:bg-red-700
                 px-10 py-3 rounded-full
                 text-sm font-semibold
                 flex items-center gap-2"
    >
      {label}
      <img
        src="/play.svg"
        alt="play"
        className="w-4 h-4 transition-transform
                   group-hover:translate-x-0.5"
      />
    </a>
  );
};

export default WatchTrailerButton;
