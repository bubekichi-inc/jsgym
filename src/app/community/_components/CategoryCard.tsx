"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";

interface CategoryCardProps {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  threadCount: number;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  id,
  slug,
  title,
  description,
  threadCount,
}) => {
  return (
    <Link
      href={`/community/categories/${slug}`}
      className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {title}
          </h3>
          {description && (
            <p className="mt-1 text-sm text-gray-600">
              {description}
            </p>
          )}
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <FontAwesomeIcon icon={faComments} className="mr-1" />
          <span>{threadCount}</span>
        </div>
      </div>
    </Link>
  );
};