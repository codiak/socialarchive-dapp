import React, { useState } from "react";
import "./archive-tweets.css";
import TweetCard, { Tweet } from "../tweet/tweet";
// import { Link } from 'react-router-dom';

export default function ArchiveTweets(props: { tweets: Tweet[]; account: any; profile: any }) {
  const { account, profile, tweets } = props;
  const [activeTab, setActiveTab] = useState(0);
  const tweetFilters = [
    { title: "Tweets", exclude: ["in_reply_to_status_id", "retweeted"] },
    { title: "Replies", include: ["in_reply_to_status_id"] },
    { title: "Retweets", include: ["retweeted"] },
    {
      title: "Media",
      filterFunc: ({extended_entities}) => {
        return !!extended_entities
      },
    },
  ];
  const { exclude, include, filterFunc, title } = tweetFilters[activeTab];
  const filteredTweets = tweets.filter((tweet: any) => {
    let keep = true;
    (exclude || []).forEach((p) => {
      if (tweet[p]) {
        keep = false;
      }
    });
    (include || []).forEach((p) => {
      if (!tweet[p]) {
        keep = false;
      }
    });
    if (keep && filterFunc) {
      keep = filterFunc(tweet);
    }
    return keep;
  });

  return (
    <>
      <div className="tab-row">
        {tweetFilters.map((section, index) => {
          // @ts-ignore
          return (
            <div key={index} className={"tab tab-big " + (activeTab === index ? "active" : "")} onClick={() => setActiveTab(index)}>
              {section.title}
            </div>
          );
        })}
      </div>
      {filteredTweets.length === 0 && <div className="row fill-message">User does not have any archived {title}.</div>}
      {filteredTweets.map((tweet: Tweet, i) => {
        // @ts-ignore
        return <TweetCard key={i} tweet={tweet} account={account} profile={profile} />;
      })}
    </>
  );
}
