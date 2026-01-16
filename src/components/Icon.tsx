type IconProps = {
  name: string; // contoh: "heart-filled.svg"
  className?: string;
  alt?: string;
};

const Icon = ({ name, className, alt }: IconProps) => {
  return (
    <img
      src={`/${name}`}
      alt={alt ?? name}
      className={className}
      draggable={false}
    />
  );
};

export default Icon;
