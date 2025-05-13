import ReactPaginate from "react-paginate";
import { EdgeButton } from "./EdgeButton";
import { PaginationIcon } from "./PaginationIcon";
import { useDevice } from "@/app/_hooks/useDevice";

interface Props {
  pageCount: number;
  currentPage: number;
  handlePageChange: (currentPage: number) => void;
}

export const Pagination: React.FC<Props> = ({
  pageCount,
  currentPage,
  handlePageChange,
}) => {
  const { isSp } = useDevice();

  const onPageChange = (e: { selected: number }) => {
    handlePageChange(e.selected + 1);
  };

  const baseClassName =
    "flex size-8 items-center justify-center rounded-full text-medium md:size-10";

  return (
    <div className="mx-auto mt-10 flex w-full max-w-[1152px] flex-wrap items-center justify-center gap-x-2 rounded-full bg-white px-4 py-2.5 shadow-blue md:mt-20 md:gap-x-3">
      <EdgeButton
        toPage={1}
        ariaLabel="最初のページへ"
        currentPage={currentPage}
        handlePageChange={handlePageChange}
        isSp={isSp}
        baseClassName={baseClassName}
      />
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
          "flex flex-wrap items-center justify-center gap-x-2 md:gap-x-3"
        }
        previousLinkClassName={baseClassName}
        nextLinkClassName={baseClassName}
        pageLinkClassName={baseClassName}
        activeLinkClassName={`${baseClassName} bg-baseBlack text-white`}
        ariaLabelBuilder={(page) => `ページ ${page + 1}へ`}
      />
      <EdgeButton
        toPage={pageCount}
        ariaLabel="最後のページへ"
        rotate={true}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
        isSp={isSp}
        baseClassName={baseClassName}
      />
    </div>
  );
};
