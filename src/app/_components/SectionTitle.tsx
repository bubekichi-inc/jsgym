export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl/[1.5] font-bold md:text-center md:text-[2.5rem]/[1.5]">
      {children}
    </h2>
  );
}
