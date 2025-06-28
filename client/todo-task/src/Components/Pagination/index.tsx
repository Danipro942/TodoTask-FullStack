import React from "react";
import style from "./style.module.css";

type PaginationProps = {
  totalItems: number;
  perPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({
  totalItems,
  perPage,
  currentPage,
  onPageChange,
}: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / perPage);
  return (
    <div className={style.pagination}>
      {[...Array(totalPages)].map((_, index) => {
        const page = index + 1;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            style={{
              margin: "0 5px",
              backgroundColor: currentPage === page ? "blue" : "white",
              color: currentPage === page ? "white" : "black",
              cursor: "pointer",
            }}
          >
            {page}
          </button>
        );
      })}
    </div>
  );
};

export default Pagination;
