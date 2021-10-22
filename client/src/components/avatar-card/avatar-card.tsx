import React from "react";
import "./avatar-card.css";
import { ACCOUNT } from "../../data/cody/account";
import { PROFILE } from "../../data/cody/profile";

export default function AvatarCard(props: any) {
  const { hideBio } = props;
  const { username, accountDisplayName } = ACCOUNT.account;
  const { avatarMediaUrl, description } = PROFILE.profile;
  const bio = description.bio;

  return (
    <>
      <div className="card">
        <img alt="User Icon" className="avatar-img" src={avatarMediaUrl} />
        <div className="account-name">{accountDisplayName}</div>
        <div className="account-handle">@{username}</div>
      </div>
      {!hideBio && <p>{bio}</p>}
    </>
  );
}
