import Image from "next/image";

export function Logo() {
  return <Image src="/images/logo.png" alt="logo" width={300} height={300} className="w-[90px]" />;
}
