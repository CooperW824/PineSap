"use client";

import { useState } from "react";

export default function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const [inputValue, setInputValue] = useState(currentPage.toString());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    const desiredPage = Number(inputValue);
    if (desiredPage >= 1 && desiredPage <= totalPages) {
      onPageChange(desiredPage);
    } else {
      setInputValue(currentPage.toString());
    }
  };
  return (
    <div className="join">
      <button
        className="btn btn-sm btn-neutral disabled:text-base-100 enabled:text-white join-item"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lt;&lt;
      </button>
      <div className="join-item flex items-center w-fit bg-base-200 px-2">
        <input
          className="input input-neutral rounded-sm mx-0 w-8 h-7 bg-base-300 mr-1 text-center"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
        />{" "}
        <span className="text-nowrap">of {totalPages}</span>
      </div>
      <button
        className="btn btn-sm btn-neutral disabled:text-base-100 enabled:text-white join-item"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &gt;&gt;
      </button>
    </div>
  );
}
