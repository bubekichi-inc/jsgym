import Image from "next/image";

interface Props {
  src: string;
  alt: string;
  rotate?: boolean;
}

export default function PaginationIcon({ src, alt, rotate = false }: Props) {
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
}
