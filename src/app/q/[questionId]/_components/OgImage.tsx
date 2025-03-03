/* eslint-disable @next/next/no-img-element */
import React from "react";

interface Props {
  title: string;
  content: string;
  lessonId: number;
  courseId: number;
}

export const OgImage: React.FC<Props> = ({
  title,
  content,
  lessonId,
  courseId,
}: Props) => {
  const levelsMap = {
    1: "初級",
    2: "中級",
    3: "上級",
  };

  // const levelsStyleMap = {
  //   1: "bg-yellow-600",
  //   2: "bg-yellow-600",
  //   3: "bg-yellow-600",
  // };

  const courseMap = {
    1: "JavaScript",
    // 2: "TypeScript",
    // 3: "React",
  };

  const courseStyleMap = {
    1: "bg-yellow-600",
    // 2: "bg-blue-600",
    // 3: "bg-red-600",
  };

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        backgroundColor: "#BBBDC5",
        padding: "32px",
        fontFamily: "'Noto Sans JP', sans-serif",
        color: "#333333",
      }}
    >
      <div tw="bg-gray-50 flex rounded-3xl bg-white w-full flex flex-col justify-between pt-[48px] pb-[32px] px-[60px] relative overflow-hidden shadow-lg">
        <img
          src="https://shiftb.dev/images/fv_pc.png"
          alt="bg"
          tw="absolute inseet-0 object-contain w-screen"
        />
        <div tw="flex flex-col gap-4 items-start">
          <span
            tw={`text-[48px] font-[700] px-8 rounded-full py-2 mb-4 text-white ${
              courseStyleMap[courseId as keyof typeof courseStyleMap]
            }`}
          >
            {courseMap[courseId as keyof typeof courseMap]}{" "}
            {levelsMap[lessonId as keyof typeof levelsMap]}
          </span>
          <p tw="text-[64px] font-[700]">{title}</p>
          <p tw="text-[32px] font-[400]">{content}</p>
        </div>
        <div tw="flex items-end justify-between pb-8">
          <div tw="flex items-center">
            <div tw={`flex items-center gap-2`}>
              <span tw="text-[40px] font-[700]">JS Gym</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
