"use client";
import { faEdit, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Reviewer } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";

type ReviewerCardProps = {
  reviewer: Reviewer;
};

export const ReviewerCard = ({ reviewer }: ReviewerCardProps) => {
  const router = useRouter();

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg">
      <div className="relative p-4">
        <div className="mb-4 flex items-center">
          <div className="relative mr-4 size-16 overflow-hidden rounded-full bg-gray-100">
            {reviewer.profileImageUrl ? (
              <Image
                src={reviewer.profileImageUrl}
                alt={reviewer.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                <FontAwesomeIcon icon={faUserCircle} size="2x" />
              </div>
            )}
          </div>
          <div>
            <h3 className="text-xl font-semibold">{reviewer.name}</h3>
            <p className="text-sm text-gray-500">ID: {reviewer.id}</p>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="mb-1 text-sm font-semibold text-gray-700">
            公開プロフィール
          </h4>
          <p className="line-clamp-2 text-sm text-gray-600">{reviewer.bio}</p>
        </div>

        <div className="mb-4">
          <h4 className="mb-1 text-sm font-semibold text-gray-700">
            非公開プロフィール
          </h4>
          <p className="line-clamp-2 text-sm text-gray-600">
            {reviewer.hiddenProfile}
          </p>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={() => router.push(`/admin/reviewers/${reviewer.id}`)}
            className="mr-2 flex items-center rounded-md bg-blue-50 px-3 py-1 text-sm text-blue-700 transition-colors hover:bg-blue-100"
          >
            <FontAwesomeIcon icon={faEdit} className="mr-1" />
            編集
          </button>
        </div>
      </div>
    </div>
  );
};
