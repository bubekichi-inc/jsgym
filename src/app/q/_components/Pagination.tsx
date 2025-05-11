import ReactPaginate from "react-paginate";
import PaginationIcon from "./PaginationIcon";
import { useDevice } from "@/app/_hooks/useDevice";

interface Props {
  pageCount: number;
  currentPage: number;
  handlePageChange: (currentPage: number) => void;
}

export default function Pagination({
  pageCount,
  currentPage,
  handlePageChange,
}: Props) {
  const { isSp } = useDevice();

  const onPageChange = (e: { selected: number }) => {
    handlePageChange(e.selected + 1);
  };

  const baseClassName =
    "flex size-8 items-center justify-center rounded-full text-medium md:size-10";

  const renderEdgeButton = (
    toPage: number,
    ariaLabel: string,
    rotate?: boolean
  ) => {
    if (isSp || currentPage === toPage) return null;

    return (
      <button
        type="button"
        onClick={() => handlePageChange(toPage)}
        aria-label={ariaLabel}
        className={baseClassName}
      >
        <PaginationIcon
          src="/images/pagination/d-arrow.svg"
          alt={ariaLabel}
          rotate={rotate}
        />
      </button>
    );
  };

  return (
    <div className="mx-auto mt-10 flex w-full max-w-[1152px] flex-wrap items-center justify-center gap-x-2 rounded-full bg-white px-4 py-2.5 shadow-blue md:mt-20 md:gap-x-3">
      {renderEdgeButton(1, "最初のページへ")}
      <ReactPaginate
        previousLabel={
          currentPage === 1 ? null : (
            <PaginationIcon
              src="/images/pagination/arrow.svg"
              alt="前のページへ"
            />
          )
        }
        nextLabel={
          currentPage === pageCount ? null : (
            <PaginationIcon
              src="/images/pagination/arrow.svg"
              alt="次のページへ"
              rotate={true}
            />
          )
        }
        breakLabel={
          <PaginationIcon src="/images/pagination/break_label.svg" alt="" />
        }
        pageCount={pageCount}
        marginPagesDisplayed={1}
        pageRangeDisplayed={isSp ? 1 : 5}
        onPageChange={onPageChange}
        forcePage={currentPage - 1}
        containerClassName={
          "flex flex-wrap items-center justify-center gap-x-2"
        }
        previousLinkClassName={baseClassName}
        nextLinkClassName={baseClassName}
        pageLinkClassName={baseClassName}
        activeLinkClassName={`${baseClassName} bg-baseBlack text-white`}
        ariaLabelBuilder={(page) => `ページ ${page + 1}へ`}
      />
      {renderEdgeButton(pageCount, "最後のページへ", true)}
    </div>
  );
}
