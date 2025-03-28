"use client";

import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import { useQuestionTags } from "../_hooks/useQuestionTags";

interface TagMultiSelectProps {
  selectedTagIds: number[];
  onChange: (selectedTagIds: number[]) => void;
}

export const TagMultiSelect: React.FC<TagMultiSelectProps> = ({
  selectedTagIds,
  onChange,
}) => {
  const { tags, isLoading, error } = useQuestionTags();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const toggleTag = (tagId: number) => {
    if (selectedTagIds.includes(tagId)) {
      onChange(selectedTagIds.filter((id) => id !== tagId));
    } else {
      onChange([...selectedTagIds, tagId]);
    }
  };

  const removeTag = (tagId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedTagIds.filter((id) => id !== tagId));
  };

  if (isLoading) {
    return <div className="text-sm text-gray-500">タグを読み込み中...</div>;
  }

  if (error) {
    return <div className="text-sm text-red-500">タグの取得に失敗しました</div>;
  }

  const selectedTags = tags.filter((tag) => selectedTagIds.includes(tag.id));

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        className="flex min-h-[38px] w-full cursor-pointer flex-wrap items-center rounded border border-gray-300 bg-white px-3 py-2"
        onClick={toggleDropdown}
      >
        {selectedTags.length > 0 ? (
          selectedTags.map((tag) => (
            <div
              key={tag.id}
              className="m-1 flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
            >
              {tag.name}
              <button
                onClick={(e) => removeTag(tag.id, e)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                <FontAwesomeIcon icon={faTimes} size="xs" />
              </button>
            </div>
          ))
        ) : (
          <span className="text-gray-500">タグを選択してください</span>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
          <ul className="py-1">
            {tags.map((tag) => (
              <li
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className="flex cursor-pointer items-center px-4 py-2 hover:bg-gray-100"
              >
                <div className="mr-2 flex size-5 items-center justify-center rounded border border-gray-300">
                  {selectedTagIds.includes(tag.id) && (
                    <FontAwesomeIcon
                      icon={faCheck}
                      className="text-blue-600"
                      size="xs"
                    />
                  )}
                </div>
                <span>{tag.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
