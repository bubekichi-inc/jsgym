import { useParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { useApi } from "@/app/_hooks/useApi";
import { Draft } from "@/app/api/questions/_types/Draft";

interface Props {
  answer: string;
}
export const ButtonArea: React.FC<Props> = ({ answer }) => {
  const { post } = useApi();
  const { questionId } = useParams();
  const saveDraft = async () => {
    try {
      post<Draft, { message: string }>(`/api/questions/${questionId}/draft`, {
        answer,
      });
      toast.success("下書き保存しました");
    } catch (e) {
      console.error(e);
      toast.success("下書き保存に失敗しました");
    }
  };
  return (
    <div className="">
      <Toaster position="top-right" />
      <button
        type="button"
        className="bg-[#777777] w-[162px] h-[46px] rounded-md"
        onClick={saveDraft}
      >
        下書き保存
      </button>
    </div>
  );
};
