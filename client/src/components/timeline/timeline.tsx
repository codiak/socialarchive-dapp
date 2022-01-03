import React from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";

import "./timeline.css";
import AvatarCard from "../avatar-card/avatar-card";
import TweetCard, { Tweet } from "../tweet/tweet";
import { TWEET_SUBSET } from "../../data/cody/tweet";
// import { ACCOUNT } from "../../data/cody/account";
// import { PROFILE } from "../../data/cody/profile";
import { FOLLOWERS } from "../../data/cody/follower";
import { FOLLOWING } from "../../data/cody/following";
import { useStore } from "../../utils/store";
import BackupStats from "../backup-stats/backup-stats";

export default function Timeline() {
  const {
    state: { pendingBackup }, // nested destructure!
  } = useStore();
  const { section } = useParams();
  // if (unZippedFiles && unZippedFiles.length > 0) {
  //   console.log("unZippedFiles: ", unZippedFiles);
  //   const manifest = unZippedFiles[0].data;
  //   console.log("manifest: ", manifest);
  // }
  console.log(pendingBackup)
  if (!pendingBackup || !pendingBackup.account) {
    return (<h2>Account backup not found</h2>)
  }

  const page = section || "account";
  const btnClasses = "btn rounded-btn ";
  const {account, profile} = pendingBackup;
  const { username, accountDisplayName } = account;
  const { description } = profile;
  const followingCount = FOLLOWING.length;
  const followersCount = FOLLOWERS.length;
  const tweets = pendingBackup.tweet || [];

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
          <Link to={"/timeline/" + username + "/home"} className={btnClasses + (page === "home" ? "active" : "")}>
            Home
          </Link>
          <br />
          <Link to={"/timeline/" + username + "/account"} className={btnClasses + (page === "account" ? "active" : "")}>
            Account
          </Link>
          <br />
          <Link to={"/timeline/" + username + "/tweets"} className={btnClasses + (page === "tweets" ? "active" : "")}>
            Tweets
          </Link>
          <br />
        </div>
      </div>
      <div className="feed-col">
        {/***** Home/Stats Content ******/}
        {page === "home" && (
          <div className="account-home">
            <BackupStats backup={pendingBackup}></BackupStats>
          </div>
        )}
        {/***** Account Content ******/}
        {page === "account" && (
          <div className="account-info">
            <div className="row">
              <h3>Username</h3>
              {username}
            </div>
            <div className="row">
              <h3>Account display name</h3>
              {accountDisplayName}
            </div>
            <div className="row">
              <h3>Bio</h3>
              {description["bio"]}
            </div>
            <div className="row">
              <h3>Website</h3>
              {description["website"]}
            </div>
            <div className="row">
              <h3>Location</h3>
              {description["location"]}
            </div>
            <div className="row">
              <h3>Tweets</h3>
              <a href="/timeline/tweets">{TWEET_SUBSET.length}</a>
            </div>
            <div className="row">
              <h3>Followers</h3>
              {followersCount}
            </div>
            <div className="row">
              <h3>Following</h3>
              {followingCount}
            </div>
          </div>
        )}
        {/***** Tweet Timeline ******/}
        {page === "tweets" &&
          tweets.map((tweet: Tweet) => {
            return <TweetCard tweet={tweet} account={account} profile={profile} />;
          })}
      </div>
      <div className="metadata-col">{/* Metadata */}</div>
    </div>
  );
}
