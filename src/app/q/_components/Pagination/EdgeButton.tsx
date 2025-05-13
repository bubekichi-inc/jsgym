import { PaginationIcon } from "./PaginationIcon";

interface Props {
  toPage: number;
  ariaLabel: string;
  rotate?: boolean;
  currentPage: number;
  handlePageChange: (currentPage: number) => void;
  isSp?: boolean;
  baseClassName: string;
}

export const EdgeButton: React.FC<Props> = ({
  toPage,
  ariaLabel,
  rotate = false,
  currentPage,
  handlePageChange,
  isSp = false,
  baseClassName,
}) => {
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
