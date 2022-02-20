import React, { useState } from "react";
import "./archive-tweets.css";
import TweetCard, { Tweet } from "../tweet/tweet";
import { useSearchParams } from "react-router-dom";
import ReactPaginate from "react-paginate";

const PAGE_SIZE = 20;

export default function ArchiveTweets(props: { tweets: Tweet[]; account: any; profile: any }) {
  const { account, profile, tweets } = props;
  const [activeTab, setActiveTab] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get("sort");
  const page: number = parseInt(searchParams.get("page")) || 1;
  const tweetFilters = [
    { title: "Tweets", exclude: ["in_reply_to_status_id", "retweeted"] },
    { title: "Replies", include: ["in_reply_to_status_id"] },
    { title: "Retweets", include: ["retweeted"] },
    {
      title: "Media",
      filterFunc: ({ extended_entities }) => {
        return !!extended_entities;
      },
    },
  ];
  const { exclude, include, filterFunc, title } = tweetFilters[activeTab];
  const filteredTweets = tweets
    .filter((tweet: any) => {
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
    })
    .sort((a, b) => {
      /** @todo: parse dates ahead of time */
      let date_a = Date.parse(a.created_at);
      let date_b = Date.parse(b.created_at);
      if (sort === "asc") {
        [date_a, date_b] = [date_b, date_a];
      }
      return date_b - date_a;
    });
  const pageCount = Math.floor(filteredTweets.length / PAGE_SIZE);
  const handlePage = ({ selected }) => {
    setSearchParams({ page: selected + 1 });
    window.scrollTo(0, 0);
  };
  const cursor = (page - 1) * PAGE_SIZE;
  const pageItems = filteredTweets.slice(cursor, cursor + PAGE_SIZE);

  return (
    <>
      <div className="tab-row">
        {tweetFilters.map((section, index) => {
          // @ts-ignore
          return (
            <div
              key={index}
              className={"tab tab-big " + (activeTab === index ? "active" : "")}
              onClick={() => setActiveTab(index)}
            >
              {section.title}
            </div>
          );
        })}
      </div>
      <div className="tab-row text-right">
        <div
          className="btn btn-toggle"
          onClick={() => setSearchParams({ sort: sort === "asc" ? "desc" : "asc" })}
        >
          {sort === "asc" ? "Oldest  ⬆️" : "Newest  ⬇️"}
        </div>
      </div>
      {filteredTweets.length === 0 && (
        <div className="row fill-message">User does not have any archived {title}.</div>
      )}
      {pageItems.map((tweet: Tweet, i) => {
        // @ts-ignore
        return <TweetCard key={i} tweet={tweet} account={account} profile={profile} />;
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
