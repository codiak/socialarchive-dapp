import React from "react";
import "./archive-likes.css";
import ReactPaginate from "react-paginate";
import { useSearchParams } from "react-router-dom";

const PAGE_SIZE = 30;

export default function ArchiveLikes(props: { likes: Like[] }) {
  const likes = props.likes;
  const [searchParams, setSearchParams] = useSearchParams();
  const page: number = parseInt(searchParams.get("page")) || 1;
  const pageCount = Math.floor(likes.length / PAGE_SIZE);
  const cursor = (page - 1) * PAGE_SIZE;
  const pageItems = likes.slice(cursor, cursor + PAGE_SIZE);

  const handlePage = ({ selected }) => {
    setSearchParams({ page: selected + 1 });
    window.scrollTo(0, 0);
  };

  return (
    <>
      <div className="heading-row">
        <h3>
          Likes <span className="secondary-text">({likes.length.toLocaleString()})</span>
        </h3>
      </div>
      {pageItems.map((like: any, i) => {
        return (
          <div key={i} className="tweet-card">
            <div>
              <div className="default-avatar">
                <img className="icon-avatar" src="/icons/avatar.svg" alt="Avatar" />
              </div>
              {like.fullText}
            </div>
            <a className="like-link" href={like.expandedUrl} target="_blank" rel="noreferrer">
              View on Twitter
              <img className="icon-link" src="/icons/link.svg" alt="Open Link" />
            </a>
          </div>
        );
      })}
      <ReactPaginate
        className="paginate-list"
        breakLabel="..."
        nextLabel=">"
        onPageChange={handlePage}
        pageRangeDisplayed={3}
        pageCount={pageCount}
        previousLabel="<"
        renderOnZeroPageCount={null}
      />
    </>
  );
}

export interface Like {
  expandedUrl: string;
  fullText: string;
  tweetId: string;
}
