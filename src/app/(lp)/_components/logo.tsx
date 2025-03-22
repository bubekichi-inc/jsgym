import Image from "next/image";

interface Props {
  width?: number;
}

export function Logo({ width = 80 }: Props) {
  const widthClass = `w-[${width}px]`;
  return (
    <div className={`${widthClass} aspect-[90/27]`}>
      <Image
        src="/images/logo.png"
        alt="logo"
        width={400}
        height={400}
        className="size-full object-contain"
      />
    </div>
  );
}
