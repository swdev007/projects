import { Fragment } from "react";
import leftArrow from "../../assets/images/arrow-left.svg";
import rightArrow from "../../assets/images/arrow-right.svg";
import style from "./pagination.module.scss";
interface PaginationProps {
  count: number;
  limit: number;
  currentPage: number;
  selectPage: Function;
}

function checkVisible(
  index: number,
  currentPage: number,
  length: number
): boolean {
  if (
    index !== 0 &&
    index !== 1 &&
    index !== length - 1 &&
    index !== length - 2 &&
    (currentPage < index || currentPage > index + 2)
  ) {
    return true;
  }
  return false;
}

export default function Pagination({
  count,
  limit,
  currentPage,
  selectPage,
}: PaginationProps) {
  const pagesCount = Math.ceil((count || 0) / limit);
  const array = new Array(pagesCount).fill(0);

  return (
    <>
      <div className={` ${style.pagination} flexWrap alignCenter`}>
        <p>
          Showing {count === 0 ? 0 : (currentPage - 1) * limit + 1} to{" "}
          {Math.min(currentPage * limit, count)} of {count} enteries
        </p>
        <div className={`${style.pagination__list} flex alignCenter`}>
          {currentPage !== 1 && (
            <div onClick={() => selectPage(currentPage - 1)}>
              {" "}
              <img src={leftArrow} alt="Arrow" />{" "}
            </div>
          )}
          <>
            {array.map((el, index) => {
              if (checkVisible(index, currentPage, array.length)) {
                return (
                  <Fragment key={index}>
                    {checkVisible(index, currentPage, array.length) &&
                    checkVisible(index - 1, currentPage, array.length)
                      ? ""
                      : "..."}
                  </Fragment>
                );
              }
              return (
                <span
                  className={`${currentPage === index + 1 ? style.active : ""}`}
                  key={index}
                  onClick={
                    currentPage !== index + 1
                      ? () => selectPage(index + 1)
                      : () => {}
                  }
                >
                  {index + 1}
                </span>
              );
            })}
          </>

          {array.length > currentPage && currentPage !== array.length && (
            <div onClick={() => selectPage(currentPage + 1)}>
              <img src={rightArrow} alt="Arrow" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
