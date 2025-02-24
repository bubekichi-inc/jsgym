import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ComponentPropsWithRef } from "react";

type Props = ComponentPropsWithRef<"button">;

export const EllipsisButton: React.FC<Props> = (props) => {
  return (
    <button
      className="rounded-full px-2 py-1 duration-150 hover:bg-gray-200"
      {...props}
    >
      <FontAwesomeIcon icon={faEllipsis} className="size-6 text-gray-600" />
    </button>
  );
};
