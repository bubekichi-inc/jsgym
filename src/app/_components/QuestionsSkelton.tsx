import { Skeleton } from "./Skeleton";

export const QuestionsSkelton = () => {
  return (
    <div className="px-6">
      <div className="mx-auto mt-8 grid max-w-[1152px] grid-cols-1 gap-5 md:mt-10 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index}>
            <div className="flex flex-col gap-y-4 rounded-2xl bg-white p-6 shadow-blue">
              <div className="flex justify-between">
                <div className="flex flex-col gap-y-2">
                  <Skeleton width={150} height={16} />
                  <div className="flex items-center gap-x-2.5">
                    <Skeleton width={117} height={28} />
                    <Skeleton width={40} height={40} round={20} />
                  </div>
                </div>
                <Skeleton width={80} height={48} />
              </div>
              <Skeleton height={100} />
              <div className="flex flex-wrap gap-2">
                <Skeleton width={72} height={18} />
                <Skeleton width={72} height={18} />
                <Skeleton width={72} height={18} />
              </div>
              <Skeleton height={40} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
