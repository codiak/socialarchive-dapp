import React from "react";
import "./avatar-card.css";
import { ACCOUNT } from "../../data/cody/account";
import { PROFILE } from "../../data/cody/profile";

export default function AvatarCard(props: any) {
  const { hideBio, date, tweetId } = props;
  const { username, accountDisplayName } = ACCOUNT.account;
  const { avatarMediaUrl, description } = PROFILE.profile;
  const bio = description.bio;

  return (
    <>
      <div className="card">
        <img alt="User Icon" className="avatar-img" src={avatarMediaUrl} />
        <div className="account-name">
          {accountDisplayName}
          <div className="account-handle">@{username}</div>
          {  date && (<div className="tweet-date">
            &nbsp;• <a href={'https://twitter.com/' + username + '/status/' + tweetId} target="_blank">
              {date}
            </a>
          </div>) }
        </div>
      </div>
      {!hideBio && <p className="account-bio">{bio}</p>}
    </>
  );
}
