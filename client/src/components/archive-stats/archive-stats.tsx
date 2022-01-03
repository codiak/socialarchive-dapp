import React from 'react';
import "./archive-stats.css";

export default function ArchiveStats(props: { backup: any }) {
    const { tweet } = props.backup;
    const quickStats = [{
        title: 'Tweets',
        icon: 'tweet',
        count: tweet.length
      }, {
        title: 'Likes',
        icon: 'like',
        count: 100
      }, {
        title: 'Blocked Accounts',
        icon: 'block',
        count: 100
      }, {
        title: 'Muted Accounts',
        icon: 'mute',
        count: 100
      }, {
        title: 'Lists',
        icon: 'list',
        count: 100
      }, {
        title: 'Moments',
        icon: 'moment',
        count: 100
      }]

    return (<>
        <br/>
        <h2 className="small">Quick stats</h2>
        <p className="help-text">Here’s a glance at some numbers from your archive:</p>
        { quickStats.map((stat: any) => {
            const iconsrc = process.env.PUBLIC_URL + '/icons/' + stat.icon + '.svg'
            return (
            <div className="stat-block">
                <img src={iconsrc} alt={stat.title} className="icon"/>
                {stat.title}
                <br/>
                <b>{stat.count}</b>
                <div className="hover-show">View</div>
            </div>);
        })}
    </>)
};
