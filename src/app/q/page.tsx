import { Questions } from "../(lp)/_components/Questions";
import { Footer } from "../(lp)/_components/footer";

export default async function Page() {
  return (
    <div className="">
      <div className="mx-auto min-h-[calc(100vh-150px)] max-w-[1200px]">
        <Questions limit={100} />
      </div>
      <Footer />
    </div>
  );
}
