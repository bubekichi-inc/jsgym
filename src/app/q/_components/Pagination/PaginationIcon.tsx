import Image from "next/image";

interface Props {
  src: string;
  alt: string;
  rotate?: boolean;
}

export const PaginationIcon: React.FC<Props> = ({
  src,
  alt,
  rotate = false,
}) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={40}
      height={40}
      className={`size-8 object-contain md:size-10 ${
        rotate ? "rotate-180" : ""
      }`}
    />
  );
};
