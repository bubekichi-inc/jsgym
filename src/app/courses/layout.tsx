import { Header } from "../_components/Header";
export default function CoursesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="pt-[72px]">{children}</div>
    </>
  );
}
