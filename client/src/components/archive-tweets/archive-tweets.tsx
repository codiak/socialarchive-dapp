import React, {useState} from 'react';
import './archive-tweets.css';
import TweetCard, { Tweet } from "../tweet/tweet";
// import { Link } from 'react-router-dom';

export default function ArchiveTweets(props: { tweets: Tweet[], account: any, profile: any }) {
    const { account, profile, tweets } = props;
    const [activeTab, setActiveTab] = useState(0);
    const tweetFilters = [
        { title: "Tweets", exclude: ["in_reply_to_status_id", "retweeted"] },
        { title: "Replies", include: ["in_reply_to_status_id"] },
        { title: "Retweets", include: ["retweeted"] }
    ];
    const activeFilter = tweetFilters[activeTab];
    const filteredTweets = tweets.filter((tweet:any) => {
        let keep = true;
        (activeFilter['exclude'] || []).forEach(p => {
            if (tweet[p]) {
                keep = false;
            }
        });
        (activeFilter['include'] || []).forEach(p => {
            if (!tweet[p]) {
                keep = false;
            }
        });
        return keep;
    })

    return (<>
        <div className="tab-row">
            { tweetFilters.map((section, index) => {
                return (<div className={"tab tab-big " + (activeTab === index ? 'active' : '')}
                            onClick={() => setActiveTab(index)}>
                    {section.title}
                </div>)
            })}
        </div>
        { filteredTweets.length === 0 && (
            <div className="row fill-message">
                User does not have any archived {activeFilter.title}.
            </div>
        )}
        { filteredTweets.map((tweet: Tweet) => {
            return <TweetCard tweet={tweet} account={account} profile={profile} />;
        })}
    </>)
};
