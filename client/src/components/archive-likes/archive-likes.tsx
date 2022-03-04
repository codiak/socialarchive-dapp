import React from "react";
import "./archive-likes.css";
import Paginate from "../paginate/paginate";
import { useSearchParams } from "react-router-dom";


export default function ArchiveLikes(props: { likes: Like[] }) {
  const likes = props.likes;
  const [searchParams] = useSearchParams();
  const page: number = parseInt(searchParams.get("page")) || 1;
  const size: number = parseInt(searchParams.get("size")) || 1;
  const cursor = (page - 1) * size;
  const pageLikes = likes.slice(cursor, cursor + size);

  return (
    <>
      <div className="heading-row">
        <h3>
          Likes <span className="secondary-text">({likes.length.toLocaleString()})</span>
        </h3>
      </div>
      {pageLikes.map((like: any, i) => {
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
      <Paginate itemCount={likes.length} />
    </>
  );
}

export interface Like {
  expandedUrl: string;
  fullText: string;
  tweetId: string;
}
