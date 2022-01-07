import React from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";

import "./archive-page.css";
import AvatarCard from "../avatar-card/avatar-card";
import TweetCard, { Tweet } from "../tweet/tweet";
import { useStore } from "../../utils/store";
import ArchiveStats from "../archive-stats/archive-stats";
import ArchiveAccount from "../archive-account/archive-account";
import ArchiveLikes from "../archive-likes/archive-likes";
import ArchiveLists from "../archive-lists/archive-lists";
import ArchiveAccountList from "../archive-account-list/archive-account-list";
import { useNavigate } from "react-router-dom";

export default function ArchivePage() {
  let navigate = useNavigate();

  const {
    state: { pendingBackup }, // nested destructure!
  } = useStore();
  const { user, section } = useParams();

  console.log(pendingBackup);
  if (user === "pending" && (!pendingBackup || !pendingBackup.account)) {
    navigate("/");

    return null;
  }

  const page = section || "account";
  const btnClasses = "btn rounded-btn ";
  const { account, profile, lists } = pendingBackup;
  const tweets = pendingBackup.tweet || [];
  const likes = pendingBackup.like || [];
  const sections = [
    {
      slug: "home",
      title: "Home",
    },
    {
      slug: "account",
      title: "Account",
    },
    {
      slug: "tweets",
      title: "Tweets",
    },
    {
      slug: "like",
      title: "Likes",
    },
    {
      slug: "lists",
      title: "Lists",
    },
  ];
  const accounts = pendingBackup[page] || [];

  return (
    <div className="container">
      <HelmetProvider>
        <Helmet>
          <title>Social Archive</title>
        </Helmet>
      </HelmetProvider>
      {user === "pending" && (
        <div className="archive-pending-label">
          <b>Archive Preview</b>
          <p>Not yet backed up to Swarm.</p>
          <br />
          Confirm | Cancel
        </div>
      )}
      <div className="left-col">
        <AvatarCard archivedAccount={pendingBackup.account} archivedProfile={pendingBackup.profile} />
        {/* Date generated·March 4, 2021 at 4:03:52 PM GMT-8·Estimated size·62 MB */}
        <div className="btn-stack">
          {sections.map((section) => {
            return (
              <>
                <Link to={`/archive/${user}/${section.slug}`} className={btnClasses + (page === section.slug ? "active" : "")}>
                  {section.title}
                </Link>
                <br />
              </>
            );
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
        {page === "like" && (
          <div className="account-likes">
            <ArchiveLikes likes={likes}></ArchiveLikes>
          </div>
        )}
        {/***** Lists List ******/}
        {page === "lists" && (
          <div className="account-lists">
            <ArchiveLists lists={lists}></ArchiveLists>
          </div>
        )}
        {/***** Catch all account listing ******/}
        {["muting", "blocking", "following", "follower"].includes(page) && (
          <div className="account-block">
            <ArchiveAccountList accounts={accounts} title={page}></ArchiveAccountList>
          </div>
        )}
      </div>
      <div className="metadata-col">{/* Metadata */}</div>
    </div>
  );
}
