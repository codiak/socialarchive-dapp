import { useParams, Link } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";

import "./archive-page.css";
import AvatarCard from "../avatar-card/avatar-card";
import { useStore } from "../../utils/store";
import ArchiveStats from "../archive-stats/archive-stats";
import ArchiveAccount from "../archive-account/archive-account";
import ArchiveLikes from "../archive-likes/archive-likes";
import ArchiveLists from "../archive-lists/archive-lists";
import ArchiveMoment from "../archive-moment/archive-moment";
import ArchiveTweets from "../archive-tweets/archive-tweets";
import ArchiveAccountList from "../archive-account-list/archive-account-list";
import ArchiveSave from "../archive-save/archive-save";

export default function ArchivePage() {
  const {
    state: { pendingBackup }, // nested destructure!
  } = useStore();
  const { user, section } = useParams();
  // console.log(pendingBackup);
  const page = section || "account";
  const btnClasses = "btn rounded-btn ";

  const { account, profile, lists } = pendingBackup;
  const tweets = pendingBackup.tweet || [];
  const likes = pendingBackup.like || [];
  const moments = pendingBackup.moment || [];
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
    {
      slug: "moment",
      title: "Moments",
    },
  ];
  const disabledSections = ["Direct Messages", "Safety", "Personalziation", "Ads"];
  const accounts = pendingBackup[page] || [];

  return (
    <div className="container">
      <HelmetProvider>
        <Helmet>
          <title>Social Archive</title>
        </Helmet>
      </HelmetProvider>
      {user === "pending" && <ArchiveSave />}
      <div className="left-col">
        <AvatarCard archivedAccount={pendingBackup.account} archivedProfile={pendingBackup.profile} />
        {/* Date generated·March 4, 2021 at 4:03:52 PM GMT-8·Estimated size·62 MB */}
        <div className="btn-stack">
          {sections.map((section, i) => {
            return (
              <div key={i}>
                <Link to={`/archive/${user}/${section.slug}`} className={btnClasses + (page === section.slug ? "active" : "")}>
                  {section.title}
                </Link>
                <br />
              </div>
            );
          })}
          <p className="button-section-help-text">Private data excluded:</p>
          {disabledSections.map((title, i) => {
            return (
              <div key={i}>
                <div className={btnClasses + "disabled"}>{title}</div>
                <br />
              </div>
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
        {page === "tweets" && (
          <div className="account-tweets">
            <ArchiveTweets tweets={tweets} account={account} profile={profile}></ArchiveTweets>
          </div>
        )}
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
        {/***** Moments ******/}
        {page === "moment" && (
          <div className="account-moment">
            <ArchiveMoment moments={moments}></ArchiveMoment>
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
