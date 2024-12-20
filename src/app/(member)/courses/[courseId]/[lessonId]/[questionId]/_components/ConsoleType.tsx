interface Props {
  text: string;
}
export const ConsoleType: React.FC<Props> = ({ text }) => {
  return (
    <div className="flex h-[34px] w-[86px] items-center justify-center bg-[#CBCBCB] text-black">
      <div>{text}</div>
    </div>
  );
};
