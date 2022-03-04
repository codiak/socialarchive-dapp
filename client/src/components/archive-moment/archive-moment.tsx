import React from "react";
import "./archive-moment.css";

export default function ArchiveMoment(props: { moments: Moment }) {
  const moments = props.moments;
  const noneCreated = !moments || !moments.title;

  if (noneCreated) {
    return (
      <div>
        <div className="heading-row">
          <h3>Moments</h3>
        </div>
        <div className="row fill-message">No Moments created.</div>
      </div>
    );
  }

  return (
    <>
      {/* TODO: {moments.map((moment: Moment) => {
        return <div className="tweet-card">Moment here!</div>;
      })} */}
      <div>
        <div className="heading-row">
          <h3>Moments</h3>
        </div>
        <b>{moments.title}</b>
        <div>
          {(moments.tweets || []).map((tweet, key) => {
            const t = tweet["tweet"];
            const url = t["urls"][0];
            return (
              <div key={key}>
                <a href={url["url"]}>{url["display"]}</a>
              </div>
            );
          })}
        </div>
      </div>
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
    tweet: any; // moment tweets are different format
  }[];
}
