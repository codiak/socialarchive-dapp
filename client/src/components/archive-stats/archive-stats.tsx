import React from "react";
import { useParams, Link } from "react-router-dom";
import "./archive-stats.css";

export default function ArchiveStats(props: { backup: any }) {
  const { tweet, like, list, blocking, moment, muting } = props.backup;
  const { user } = useParams();
  const quickStats = [
    {
      title: "Tweets",
      icon: "tweets",
      count: tweet.length,
    },
    {
      title: "Likes",
      icon: "like",
      count: like ? like.length : 0,
    },
    {
      title: "Blocked Accounts",
      icon: "blocking",
      count: blocking ? blocking.length : 0,
    },
    {
      title: "Muted Accounts",
      icon: "muting",
      count: muting ? muting.length : 0,
    },
    {
      title: "Lists",
      icon: "list",
      count: list ? list.length : 0,
    },
    {
      title: "Moments",
      icon: "moment",
      count: moment ? moment.length : 0,
    },
  ];

  return (
    <>
      <br />
      <h2 className="small">Quick stats</h2>
      <p className="help-text">Here’s a glance at some numbers from your archive:</p>
      {quickStats.map((stat: any, i) => {
        const iconsrc = process.env.PUBLIC_URL + "/icons/" + stat.icon + ".svg";
        return (
          <Link key={i} to={`/archive/${user}/${stat.icon}`} className="stat-block">
            <img src={iconsrc} alt={stat.title} className="icon" />
            {stat.title}
            <br />
            <b>{stat.count}</b>
            <div className="hover-show">View</div>
          </Link>
        );
      })}
    </>
  );
}
