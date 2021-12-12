import React from "react";
import "./avatar-card.css";
import { ACCOUNT } from "../../data/cody/account";
import { PROFILE } from "../../data/cody/profile";

export default function AvatarCard(props: any) {
  const { hideBio, date, tweetId, archivedAccount, isUserRow } = props;
  const { username, accountDisplayName } = archivedAccount || ACCOUNT.account;
  const { avatarMediaUrl, description } = archivedAccount ||PROFILE.profile;
  const bio = description.bio;
  const cardStyles = ['card', isUserRow ? 'card-user-row' : ''].join(' ');

  return (
    <>
      <div className={cardStyles}>
        <img alt="User Icon" className="avatar-img" src={avatarMediaUrl} />
        <div className="account-name">
          {accountDisplayName}
          <div className="account-handle">@{username}</div>
          {  date && (<div className="tweet-date">
            &nbsp;• <a href={'https://twitter.com/' + username + '/status/' + tweetId} target="_blank" rel="noreferrer">
              {date}
            </a>
          </div>) }
        </div>
      </div>
      {!hideBio && <p className="account-bio">{bio}</p>}
    </>
  );
}
