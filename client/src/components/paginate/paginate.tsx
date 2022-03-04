import React, { useEffect } from "react";
import ReactPaginate from "react-paginate";
import { useSearchParams } from "react-router-dom";

const DEFAULT_PAGE_SIZE = 30;

export default function Paginate(props: { itemCount; pageSize? }) {
  const { itemCount, pageSize } = props;
  const [searchParams, setSearchParams] = useSearchParams();
  const currentParams = Object.fromEntries([...searchParams]);
  const page: number = parseInt(searchParams.get("page")) || 1;
  const size: number = parseInt(searchParams.get("size"));
  const PAGE_SIZE = size || pageSize || DEFAULT_PAGE_SIZE;
  const pageCount = Math.ceil(itemCount / PAGE_SIZE);

  useEffect(() => {
    if (!size) {
      setSearchParams({ ...currentParams, page: page.toString(), size: PAGE_SIZE });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handlePage = ({ selected }) => {
    setSearchParams({ ...currentParams, page: (selected + 1).toString(), size: size.toString() });
    window.scrollTo(0, 0);
  };

  return (
    <ReactPaginate
      className="paginate-list"
      breakLabel="..."
      nextLabel=">"
      onPageChange={handlePage}
      pageRangeDisplayed={3}
      pageCount={pageCount}
      forcePage={page - 1}
      previousLabel="<"
      renderOnZeroPageCount={null}
    />
  );
}
