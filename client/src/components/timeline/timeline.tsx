import React from "react";
import { useParams } from "react-router-dom";
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

export default function Timeline() {
  const {
    state: { unZippedFiles, pendingBackup }, // nested destructure!
  } = useStore();
  if (unZippedFiles && unZippedFiles.length > 0) {
    console.log("unZippedFiles: ", unZippedFiles);
    const manifest = unZippedFiles[0].data;
    console.log("manifest: ", manifest);
  }
  console.log('**** backup *****');
  console.log(pendingBackup);
  // 0: {name: 'manifest.js', type: 'json', data: {…}}
  // 1: {name: 'account-creation-ip.js', type: 'json', data: Array(1)}
  // 2: {name: 'account-timezone.js', type: 'json', data: Array(1)}
  // 3: {name: 'account.js', type: 'json', data: Array(1)}
  // 4: {name: 'ageinfo.js', type: 'json', data: Array(1)}
  // 5: {name: 'device-token.js', type: 'json', data: Array(1)}
  // 6: {name: 'follower.js', type: 'json', data: Array(2)}
  // 7: {name: 'following.js', type: 'json', data: Array(6)}
  // 8: {name: 'ip-audit.js', type: 'json', data: Array(14)}
  // 9: {name: 'like.js', type: 'json', data: Array(1)}
  // 10: {name: 'ni-devices.js', type: 'json', data: Array(1)}
  // 11: {name: 'personalization.js', type: 'json', data: Array(1)}
  // 12: {name: 'phone-number.js', type: 'json', data: Array(1)}
  // 13: {name: 'profile.js', type: 'json', data: Array(1)}
  // 14: {name: '93710905290770-YNyHklGt.jpg', type: 'jpg', data: 'data:image/jpg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/…gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA=', id: 'YNyHklGt.jpg'}
  // 15: {name: 'screen-name-change.js', type: 'json', data: Array(1)}
  // 16: {name: 'tweet.js', type: 'json', data: Array(5)}
  // 17: {name: '76456984010755-FCVkCXSaUAA_IVN.mp4', type: 'mp4', data: 'data:video/mp4;base64,AAAAGGZ0eXBtcDQyAAAAAG1wNDFp…gigsgI2u12yvEgtSQkKljJKF3jfR/DvcbvffSjzqe8bSFT/Og', id: 'FCVkCXSaUAA_IVN.mp4'}
  // 18: {name: 'verified.js', type: 'json', data: Array(1)}

  let { section } = useParams();
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
          <a href={"/timeline/" + username + "/home"} className={btnClasses + (page === "home" ? "active" : "")}>
            Home
          </a>
          <br />
          <a href={"/timeline/" + username + "/account"} className={btnClasses + (page === "account" ? "active" : "")}>
            Account
          </a>
          <br />
          <a href={"/timeline/" + username + "/tweets"} className={btnClasses + (page === "tweets" ? "active" : "")}>
            Tweets
          </a>
          <br />
        </div>
      </div>
      <div className="feed-col">
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
        {page === "tweets" &&
          tweets.map((tweet: Tweet) => {
            return <TweetCard tweet={tweet} account={account} profile={profile} />;
          })}
      </div>
      <div className="metadata-col">{/* Metadata */}</div>
    </div>
  );
}
