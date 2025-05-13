interface Props {
  children: React.ReactNode;
}

export const SectionTitle: React.FC<Props> = ({ children }) => {
  return (
    <h2 className="text-2xl/[1.5] font-bold md:text-center md:text-[2.5rem]/[1.5]">
      {children}
    </h2>
  );
};
