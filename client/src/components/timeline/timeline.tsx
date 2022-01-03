import React from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";

import "./timeline.css";
import AvatarCard from "../avatar-card/avatar-card";
import TweetCard, { Tweet } from "../tweet/tweet";
import { useStore } from "../../utils/store";
import ArchiveStats from "../archive-stats/archive-stats";
import ArchiveAccount from "../archive-account/archive-account";
import ArchiveLikes from "../archive-likes/archive-likes";

export default function Timeline() {
  const {
    state: { pendingBackup }, // nested destructure!
  } = useStore();
  const { section } = useParams();

  console.log(pendingBackup)
  if (!pendingBackup || !pendingBackup.account) {
    return (<h2>Account backup not found</h2>)
  }

  const page = section || "account";
  const btnClasses = "btn rounded-btn ";
  const {account, profile} = pendingBackup;
  const tweets = pendingBackup.tweet || [];
  const likes = pendingBackup.like || [];
  const { username } = account;
  const sections = [{
    slug: 'home',
    title: 'Home'
  }, {
    slug: 'account',
    title: 'Account'
  }, {
    slug: 'tweets',
    title: 'Tweets'
  }, {
    slug: 'likes',
    title: 'Likes'
  }]

  return (
    <div className="container">
      <HelmetProvider>
        <Helmet>
          <title>Social Archive</title>
        </Helmet>
      </HelmetProvider>
      <div className="left-col">
        <AvatarCard archivedAccount={pendingBackup.account} archivedProfile={pendingBackup.profile} />
        {/* Date generated·March 4, 2021 at 4:03:52 PM GMT-8·Estimated size·62 MB */}
        <div className="btn-stack">
          { sections.map(section => {
            return (<>
              <Link to={`/timeline/${username}/${section.slug}`} className={btnClasses + (page === section.slug ? "active" : "")}>
                { section.title}
              </Link>
              <br/>
            </>)
          })}
        </div>
      </div>
      <div className="feed-col">
        {/***** Home/Stats Content ******/}
        {page === "home" && (
          <div className="account-home">
            <ArchiveStats backup={pendingBackup}></ArchiveStats>
          </div>
        )}
        {/***** Account Content ******/}
        {page === "account" && (
          <div className="account-info">
            <ArchiveAccount backup={pendingBackup}></ArchiveAccount>
          </div>
        )}
        {/***** Tweet Timeline ******/}
        {page === "tweets" &&
          tweets.map((tweet: Tweet) => {
            return <TweetCard tweet={tweet} account={account} profile={profile} />;
          })}
        {/***** Likes List ******/}
        {page === "likes" && (
          <div className="account-likes">
            <ArchiveLikes likes={likes}></ArchiveLikes>
          </div>
        )}
      </div>
      <div className="metadata-col">{/* Metadata */}</div>
    </div>
  );
}
