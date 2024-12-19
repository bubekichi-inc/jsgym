interface Props {
  text: string;
}
export const ConsoleType: React.FC<Props> = ({ text }) => {
  return (
    <div className="bg-[#CBCBCB] text-black w-[86px] h-[34px] flex justify-center items-center">
      <div>{text}</div>
    </div>
  );
};
