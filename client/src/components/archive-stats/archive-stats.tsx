import React from 'react';
import "./archive-stats.css";

export default function ArchiveStats(props: { backup: any }) {
    const { tweet, like, list, block, moment, mute } = props.backup;
    const quickStats = [{
        title: 'Tweets',
        icon: 'tweet',
        count: tweet.length
      }, {
        title: 'Likes',
        icon: 'like',
        count: like ? like.length : 0
      }, {
        title: 'Blocked Accounts',
        icon: 'block',
        count: block ? block.length : 0
      }, {
        title: 'Muted Accounts',
        icon: 'mute',
        count: mute ? mute.length : 0
      }, {
        title: 'Lists',
        icon: 'list',
        count: list ? list.length : 0
      }, {
        title: 'Moments',
        icon: 'moment',
        count: moment ? moment.length : 0
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
