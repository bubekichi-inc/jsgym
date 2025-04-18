"use client";
import { faCheck, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EventType } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import { saveEvents } from "../_utils/saveEvents";
import { Modal } from "./Modal";

interface Props {
  count: number;
  isOpen: boolean;
  onClose: () => void;
}

export const CongratsModal: FC<Props> = ({ count, isOpen, onClose }) => {
  const handleClose = () => {
    onClose();
  };

  const features = [
    "プロのコードレビューでオリジナルアプリ完成まで無期限サポート",
    "「実務体験課題」でスクール内で実務実績を獲得",
    "卒業後に転職活動した人は100%、内定 or 副業案件獲得（自社開発or受託開発）",
  ];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} maxWidth="1200px">
      <div className="flex flex-col items-center">
        <h2 className="mb-4 text-4xl font-bold text-blue-600">
          Good Job! {count}問クリア🙌
        </h2>
        <p className="mb-6 text-sm">この調子で引き続き頑張りましょう！</p>

        <div className="mb-6 h-px w-full bg-gray-200"></div>

        <h3 className="mb-2 text-xl font-bold text-gray-800">
          さらなるスキルを身につけたい方へ...
        </h3>

        <p className="mb-10 text-sm">
          ShiftBでの本気の学習で、実務レベルの実力を最短4ヶ月で身につけませんか？
        </p>

        <div className="flex items-start gap-4">
          <div className="mb-6 flex justify-center">
            <Image
              src="/images/shiftb_banner.png"
              alt="ShiftB Logo"
              width={800}
              height={800}
              className="h-auto border border-gray-200 shadow-card"
            />
          </div>

          <div className="flex flex-col items-center">
            <p className="mb-4 text-xl font-bold text-blue-700">
              ShiftBの無料相談会を開催中！
            </p>

            <div className="mb-8 flex w-full flex-col gap-2">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start rounded-lg bg-blue-50 p-3 transition-all"
                >
                  <div className="mr-3 flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                    <FontAwesomeIcon icon={faCheck} className="size-3" />
                  </div>
                  <p className="text-left text-sm text-gray-700">{feature}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-6">
              <Link
                href="https://timerex.net/s/shuhei.tusx_7f57/08de5700/"
                target="_blank"
                className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 font-bold text-white transition-all hover:bg-blue-700"
                onClick={async () =>
                  await saveEvents({
                    type: EventType.CLICK,
                    name: "LINK_TO_TIMEREX_FROM_CONGRATULATION_MODAL",
                  })
                }
              >
                無料相談を予約する
                <FontAwesomeIcon icon={faExternalLinkAlt} className="size-4" />
              </Link>

              <div className="mb-4 text-sm text-gray-600">
                <Link
                  href="https://shiftb.dev"
                  target="_blank"
                  className="text-blue-500 hover:underline"
                  onClick={async () =>
                    await saveEvents({
                      type: EventType.CLICK,
                      name: "LINK_TO_SHIFTB_OFFICIAL_SITE_FROM_CONGRATULATION_MODAL",
                    })
                  }
                >
                  公式サイトはこちら
                </Link>
              </div>
            </div>

            <p className="text-xs font-medium text-red-500">
              今月の相談会の残り枠:{" "}
              {Math.max(3, Math.round(new Date().getDate() / 3))}名
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};
