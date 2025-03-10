import { Footer } from "../(lp)/_components/footer";
import { Questions } from "./_components/Questions";

export default async function Page() {
  return (
    <div className="">
      <div className="mx-auto min-h-[calc(100vh-150px)] max-w-[1200px]">
        <Questions limit={30} />
      </div>
      <Footer />
    </div>
  );
}
