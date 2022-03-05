import React from "react";
import "./archive-likes.css";

export default function ArchiveLikes(props: { likes: Like[] }) {
  const likes = props.likes;

  return (
    <>
      {likes.map((like: any, i) => {
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
    </>
  );
}

export interface Like {
  expandedUrl: string;
  fullText: string;
  tweetId: string;
}
