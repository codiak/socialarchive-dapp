import React from "react";
import "./archive-moment.css";

export default function ArchiveMoment(props: { moments: Moment[] }) {
  const moments = props.moments;
  const noneCreated = !moments || moments.length < 1;

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
      <div>
        <div className="heading-row">
          <h3>Moments</h3>
        </div>
        {moments.map((moment) => {
          const moment_url = "https://twitter.com/i/events/" + moment.momentId;
          return (
            <div className="moment-card">
              <h4>
                {moment.title}&nbsp;
                <a href={moment_url} target="_blank" className="help-text" rel="noreferrer">
                  <img className="icon-link" src="/icons/link.svg" alt="Open Link" />
                </a>
              </h4>
              <div>
                <p className="help-text">Tweets</p>
                {(moment.tweets || []).map((tweet, key) => {
                  const t = tweet["tweet"];
                  const text = t.coreData.text;
                  return <div key={key}>{text}</div>;
                })}
              </div>
            </div>
          );
        })}
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
    tweet: {
      coreData: {
        text: string;
        userId: string;
        createdAtSecs: string;
      };
      id: string;
      media: any[];
      hashtags: any[];
    }; // moment tweets are formatted differently from regular user tweets
  }[];
}
