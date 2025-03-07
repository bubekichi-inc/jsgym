/* eslint-disable @next/next/no-img-element */
import React from "react";
import { courseTextMap, lessonStyleMap, lessonTextMap } from "@/app/_constants";

interface Props {
  title: string;
  content: string;
  lessonId: number;
  courseId: number;
  reviewer: {
    name: string;
    bio: string;
    profileImageUrl: string;
  };
}

export const OgImage: React.FC<Props> = ({
  title,
  content,
  lessonId,
  courseId,
  reviewer,
}: Props) => {
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
        position: "relative",
      }}
    >
      <div tw="bg-gray-50 flex rounded-3xl bg-white w-full flex flex-col justify-between pt-[48px] pb-[32px] px-[60px] relative overflow-hidden shadow-lg">
        <img
          src="https://shiftb.dev/images/fv_pc.png"
          alt="bg"
          tw="absolute inseet-0 object-contain w-screen"
        />
        <div tw="flex flex-col gap-4 items-start">
          <div tw="flex items-center justify-between w-full">
            <div tw="flex items-center">
              <div tw="text-[56px] mr-8 pb-4">
                {courseTextMap[courseId as keyof typeof courseTextMap]}
              </div>
              <div
                tw={`text-[48px] font-[700] px-8 rounded-full py-2 mb-4 text-white ${
                  lessonStyleMap[lessonId as keyof typeof lessonStyleMap]
                }`}
              >
                {lessonTextMap[lessonId as keyof typeof lessonTextMap]}
              </div>
            </div>
            <img
              src={`https://jsgym.shiftb.dev${reviewer.profileImageUrl}`}
              alt=""
              tw="w-[80px] h-[80px] rounded-full"
            />
          </div>
          <p tw="text-[64px] font-[700]">{title}</p>
          <p tw="text-[32px] font-[400] text-gray-500">{content}</p>
        </div>
      </div>
      <span tw="text-[20px] absolute bottom-1 right-4 font-[700] text-gray-700">
        JS Gym
      </span>
    </div>
  );
};
