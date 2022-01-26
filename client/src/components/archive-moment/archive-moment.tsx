import React from "react";
import "./archive-moment.css";
import { Tweet } from "../tweet/tweet";

export default function ArchiveMoment(props: { moments: Moment[] }) {
  const moments = props.moments;

  return (
    <>
      {moments.map((moment: Moment) => {
        return <div className="tweet-card">Moment here!</div>;
      })}
    </>
  );
}

interface Moment {
  coverMediaUrls: string[];
  createdAt: string;
  createdBy: string;
  momentId: string;
  title: string;
  tweets: {
    momentId: string;
    tweet: Tweet;
  };
}
