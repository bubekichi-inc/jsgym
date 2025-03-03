import { Metadata } from "next";

export const DESCRIPTON = "JS Gym";
export const OGP_IMAGE_URL = "https://jsgym.shiftb.dev/images/ogp.jpg";
export const APP_URL = "https://jsgym.shiftb.dev";

interface MetadataProps {
  title: string;
  path: string;
  description?: string;
  ogp_image_url?: string;
  robots?: {
    index: boolean;
  };
}

export const buildMetaData = ({
  title,
  path,
  robots,
  description = DESCRIPTON,
  ogp_image_url = OGP_IMAGE_URL,
}: MetadataProps): Metadata => {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: title,
      url: APP_URL + path,
      images: [
        {
          url: ogp_image_url,
          width: 1200,
          height: 630,
        },
      ],
      locale: "ja_JP",
      type: "website",
    },
    twitter: {
      title,
      description: description,
      card: "summary_large_image",
      images: [ogp_image_url],
    },
    robots,
  };
};
