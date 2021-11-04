import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./timeline.css";
import AvatarCard from "../avatar-card/avatar-card";
import TweetCard, { Tweet } from "../tweet/tweet";
import { TWEET_SUBSET } from "../../data/cody/tweet";
import { ACCOUNT } from "../../data/cody/account";
import { PROFILE } from "../../data/cody/profile";
import { FOLLOWERS } from "../../data/cody/follower";
import { FOLLOWING } from "../../data/cody/following";

export default function Timeline() {
  let { section } = useParams();
  const page = section || 'account';
  const btnClasses = "btn rounded-btn ";
  const { username, accountDisplayName } = ACCOUNT.account;
  const { avatarMediaUrl, description } = PROFILE.profile;
  const followingCount = FOLLOWING.length;
  const followersCount = FOLLOWERS.length;

  return (
    <div className="container">
      <div className="left-col">
        <AvatarCard />
        {/* Date generated·March 4, 2021 at 4:03:52 PM GMT-8·Estimated size·62 MB */}
        <div className="btn-stack">
          {/* <a href="/timeline/home" className={btnClasses + (page === 'home' ? 'active' : '')}>
            Home
          </a> */}
          <br />
          <a href="/timeline/account" className={btnClasses + (page === 'account' ? 'active' : '')}>
            Account
          </a>
          <br />
          <a href="/timeline/tweets" className={btnClasses + (page === 'tweets' ? 'active' : '')}>
            Tweets
          </a>
          <br />
        </div>
      </div>
      <div className="feed-col">
        {
          page === 'account' &&
            (<div className="account-info">
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
                {description['bio']}
              </div>
              <div className="row">
                <h3>Website</h3>
                {description['website']}
              </div>
              <div className="row">
                <h3>Location</h3>
                {description['location']}
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
            </div>)
        }
        {
          page === 'tweets' &&
            TWEET_SUBSET.map((tweet) => {
              return <TweetCard tweet={tweet.tweet as Tweet} />;
            })
        }
      </div>
      <div className="metadata-col">{/* Metadata */}</div>
    </div>
  );
}
