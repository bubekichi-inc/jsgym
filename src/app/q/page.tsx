import { Questions } from "../(lp)/_components/Questions";

export default async function Page() {
  return (
    <div className="mx-auto max-w-[1200px]">
      <Questions limit={100} />
    </div>
  );
}
