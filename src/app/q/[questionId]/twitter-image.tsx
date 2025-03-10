/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import { OgImage } from "./_components/OgImage";
import { api } from "@/app/_utils/api";
import { buildMetaData } from "@/app/_utils/metadata";
import { QuestionResponse } from "@/app/api/questions/[questionId]/route";

export const runtime = "edge";

export const alt = "js gym question";
export const size = {
  width: 1200,
  height: 630,
};

export const metadata = buildMetaData({
  title: "JS Gym",
  path: "/q/[questionId]/twitter-image",
  robots: {
    index: false,
  },
});

const getUniqueChars = (text: string) => {
  const charSet = new Set();

  for (const char of text) {
    charSet.add(char);
  }

  return Array.from(charSet).join("");
};

export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ questionId: string }>;
}) {
  const { questionId } = await params;
  const data = await api.get<QuestionResponse>(
    `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/questions/${questionId}`
  );

  if (!data) return { title: "Not Found" };

  const fontData = await fetch(
    `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700&text=${encodeURIComponent(
      getUniqueChars(
        data.question.title +
          data.question.content +
          "JS Gym 基礎 応用 実務模擬 JavaScript"
      )
    )}`
  ).then((res) => res.text());
  const fontUrl = fontData.match(/url\((.*?)\)/)?.[1] || "";
  const font = await fetch(fontUrl).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <OgImage
        title={data.question.title}
        content={data.question.content}
        lessonId={data.question.lesson.id}
        courseId={data.question.lesson.course.id}
        reviewer={data.question.reviewer}
      />
    ),
    {
      ...size,
      fonts: [
        {
          name: "Noto sans jp",
          data: font,
          style: "normal",
          weight: 700,
        },
      ],
    }
  );
}
