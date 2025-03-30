import Image from "next/image";
import { MarkdownWrapper } from "@/app/_components/MarkdownWrapper";

// デフォルト画像
const DEFAULT_COURSE_IMAGE = "/images/course-default.jpg";

type CourseHeaderProps = {
  title: string;
  description: string;
  thumbnailUrl: string | null;
};

export default function CourseHeader({
  title,
  description,
  thumbnailUrl,
}: CourseHeaderProps) {
  return (
    <div className="mb-8 overflow-hidden rounded-lg bg-white shadow-md">
      <div className="relative h-64 w-full">
        <Image
          src={thumbnailUrl || DEFAULT_COURSE_IMAGE}
          alt={title}
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>
      <div className="p-6">
        <h1 className="mb-4 text-3xl font-bold">{title}</h1>
        <MarkdownWrapper>{description}</MarkdownWrapper>
      </div>
    </div>
  );
}
