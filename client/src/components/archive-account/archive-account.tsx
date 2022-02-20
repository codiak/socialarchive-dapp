import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function ArchiveAccount(props: { backup: any }) {
  const { account, profile, following, follower, tweet, verified } = props.backup;
  const [activeTab, setActiveTab] = useState(0);
  const { user } = useParams();
  const { username, accountDisplayName, accountId, createdAt } = account;
  const { avatarMediaUrl, headerMedialUrl, description } = profile;
  const { isVerified } = verified.verified;
  const followingCount = following.length;
  const followersCount = follower.length;
  const accountSections = [
    { title: "General Information" },
    { title: "Profile" },
    { title: "Connected Applications" },
    { title: "Contacts" },
    { title: "Sessions" },
    { title: "Account Access History" },
  ];

  const profileContent = (
    <>
      <div className="row">
        <h3>Username</h3>@{username}
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
        {description["website"] || "No data"}
      </div>
      <div className="row">
        <h3>Location</h3>
        {description["location"] || "No data"}
      </div>
      <div className="row">
        <h3>Tweets</h3>
        <Link to={`/archive/${user}/tweets`}>{tweet.length}</Link>
      </div>
      <div className="row">
        <h3>Followers</h3>
        {followersCount}
      </div>
      <div className="row">
        <h3>Following</h3>
        {followingCount}
      </div>
      <div className="row">
        <h3>Avatar image</h3>
        {avatarMediaUrl || "No data"}
      </div>
      <div className="row">
        <h3>Header image</h3>
        {headerMedialUrl || "No data"}
      </div>
    </>
  );

  const generalContent = (
    <>
      <div className="row">
        <h3>Creation Date</h3>
        {createdAt}
      </div>
      <div className="row">
        <h3>Account ID</h3>
        {accountId}
      </div>
      <div className="row">
        <h3>Verified</h3>
        {isVerified ? "Yes" : "No"}
      </div>
      <div className="row">
        <h3>Private data excluded:</h3>
        <ul>
          <li>User creation IP</li>
          <li>Email</li>
          <li>Phone number</li>
          <li>Age info</li>
          <li>Email changes</li>
          <li>Protected history</li>
        </ul>
      </div>
    </>
  );

  const connectedContent = (
    <>
      <div className="row fill-message">
        Connected applications data is excluded.
        <p>Private data from 3rd party applications is considered secure.</p>
      </div>
    </>
  );

  const contactsContent = (
    <>
      <div className="row fill-message">
        Private uploaded contacts data is excluded.
        <p>
          These are contacts you uploaded to find people you may know on Twitter or to personalize
          content.
        </p>
      </div>
    </>
  );

  const sessionContent = (
    <>
      <div className="row fill-message">
        Session data is excluded.
        <p>Session data includes when and how your account has been accessed.</p>
      </div>
    </>
  );

  const historyContent = (
    <>
      <div className="row fill-message">
        Access history data is excluded.
        <p>
          Login history includes any apps that are connected to your account, as well as the IP
          address and time of access.
        </p>
      </div>
    </>
  );

  return (
    <>
      <div className="tab-row">
        {accountSections.map((section, index) => {
          return (
            <div
              key={index}
              className={"tab " + (activeTab === index ? "active" : "")}
              onClick={() => setActiveTab(index)}
            >
              {section.title}
            </div>
          );
        })}
      </div>
      {activeTab === 0 && generalContent}
      {activeTab === 1 && profileContent}
      {activeTab === 2 && connectedContent}
      {activeTab === 3 && contactsContent}
      {activeTab === 4 && sessionContent}
      {activeTab === 5 && historyContent}
    </>
  );
}
