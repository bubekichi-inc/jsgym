import Image from "next/image";

interface Props {
  width?: number;
}

export const Logo: React.FC<Props> = ({ width = 80 }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const widthClass = `w-[${width}px]`;
  return (
    <div className={`aspect-[90/27] w-[80px]`}>
      <Image
        src="/images/logo.png"
        alt="logo"
        width={400}
        height={400}
        className="size-full object-contain"
      />
    </div>
  );
};
