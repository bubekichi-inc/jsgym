import {
  faEllipsis,
  faEye,
  faRefresh,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { useMessages } from "../../_hooks/useMessages";
import { useMe } from "@/app/(member)/_hooks/useMe";
import { useQuestion } from "@/app/_hooks/useQuestion";
import { api } from "@/app/_utils/api";

interface Props {
  onShowAnswer: () => void;
}

export const DropdownMenu: React.FC<Props> = ({ onShowAnswer }) => {
  const params = useParams();
  const questionId = params.questionId as string;
  const { mutate: mutateQuestion } = useQuestion({
    questionId,
  });
  const { mutate: mutateMessages } = useMessages({
    questionId,
  });
  const { data: me } = useMe();

  const handleClickRset = async () => {
    if (!confirm("解答とレビュー履歴が削除されます。宜しいですか？")) return;
    try {
      await api.del(`/api/questions/${questionId}/reset`);
      mutateQuestion();
      mutateMessages();
      toast.success("リセットしました");
    } catch {
      toast.error("エラーが発生しました");
    }
  };

  return (
    <div className="">
      <Menu as="div">
        <MenuButton className="rounded-full px-2 py-1 duration-150 hover:bg-gray-200 active:bg-gray-200">
          <FontAwesomeIcon icon={faEllipsis} className="size-6 text-gray-600" />
        </MenuButton>

        <MenuItems
          transition
          anchor={{ to: "bottom end", gap: "4px" }}
          className="w-52 origin-top-right rounded-xl border border-gray-100 bg-white p-1 text-sm shadow-popup transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-50 data-[closed]:opacity-0"
        >
          <MenuItem>
            <button
              className="group flex w-full items-center gap-3 rounded-lg p-3 font-bold data-[focus]:bg-gray-100"
              type="button"
              onClick={onShowAnswer}
            >
              <FontAwesomeIcon icon={faEye} />
              答えを見る
            </button>
          </MenuItem>
          {me && (
            <MenuItem>
              <button
                className="group flex w-full items-center gap-3 rounded-lg p-3 font-bold text-red-500 data-[focus]:bg-gray-100"
                type="button"
                onClick={handleClickRset}
              >
                <FontAwesomeIcon icon={faRefresh} />
                解答をリセット
              </button>
            </MenuItem>
          )}
        </MenuItems>
      </Menu>
    </div>
  );
};
