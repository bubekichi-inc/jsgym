import { Metadata } from "next";
import { QuestionDetailPage } from "./_components/QuestionDetailPage";
import { api } from "@/app/_utils/api";
import { QuestionResponse } from "@/app/api/questions/[questionId]/route";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ questionId: string }>;
}): Promise<Metadata> => {
  const { questionId } = await params;
  const data = await api.get<QuestionResponse>(
    `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/questions/${questionId}`
  );

  if (!data.question) return { title: "Not Found" };

  const { title, content } = data.question;

  return {
    title: title + "｜JS Gym",
    description: content,
    openGraph: {
      title: title + "｜JS Gym",
      description: content,
      siteName: "JS Gym",
      locale: "ja_JP",
      type: "website",
    },
    twitter: {
      title: title + "｜JS Gym",
      description: content,
      card: "summary_large_image",
    },
  };
};

export default async function Page() {
  return <QuestionDetailPage />;
}
