import Image from "next/image";
import Link from "next/link";

const FooterLink = ({
  href,
  text,
  beforeIconSrc,
  beforeIconAlt,
  afterIconSrc,
  afterIconAlt,
}: {
  href: string;
  text: string;
  beforeIconSrc?: string;
  beforeIconAlt?: string;
  afterIconSrc?: string;
  afterIconAlt?: string;
}) => {
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1"
      >
        {beforeIconSrc && (
          <Image
            src={beforeIconSrc}
            alt={beforeIconAlt ?? ""}
            width={20}
            height={20}
            className="size-5 object-contain"
          />
        )}
        {text}
        {afterIconSrc && (
          <Image
            src={afterIconSrc}
            alt={afterIconAlt ?? ""}
            width={20}
            height={20}
            className="size-5 object-contain"
          />
        )}
      </a>
    </li>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="grid justify-items-center bg-baseBlack pb-6 pt-12 text-sm/[1] font-medium text-white">
      <Link href="/">
        <Image
          src="/images/logo_white.svg"
          alt="JS Gymロゴ"
          width={140}
          height={42}
          className="h-auto w-[140px] object-contain md:w-40"
        />
      </Link>
      <ul className="mt-10 flex flex-col flex-wrap items-center gap-8 md:flex-row">
        <FooterLink
          href="https://bubekichi.com"
          text="運営会社"
          afterIconSrc="/images/external_link.svg"
          afterIconAlt="外部リンクアイコン"
        />
        <FooterLink
          href="https://shiftb.dev/?r=jg"
          text="運営スクール"
          afterIconSrc="/images/external_link.svg"
          afterIconAlt="外部リンクアイコン"
        />
        <FooterLink
          href="https://www.instagram.com/bube.code"
          text="bube.code"
          beforeIconSrc="/images/instagram_icon.svg"
          beforeIconAlt="インスタグラムアイコン"
        />
        <FooterLink
          href="https://www.instagram.com/bube.code"
          text="お問い合わせ"
          beforeIconSrc="/images/mail_icon.svg"
          beforeIconAlt="メールアイコン"
        />
        <FooterLink href="/terms" text="利用規約" />
        <FooterLink href="/privacy_policy" text="プライバシーポリシー" />
      </ul>
      <p className="mt-14 text-[0.625rem]/[1.4] md:mt-8">
        &copy; 2025 JS Gym. All rights reserved.
      </p>
    </footer>
  );
};
