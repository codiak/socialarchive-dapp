import React from 'react';
import './timeline.css';
import AvatarCard from '../avatar-card/avatar-card';
import Tweet from '../tweet/tweet';
import { TWEET_SUBSET } from '../../data/tweet-subset';

export default function Timeline() {


    return (
        <div className="container">
            <div className="left-col">
                <AvatarCard/>
                Date generated·March 4, 2021 at 4:03:52 PM GMT-8·Estimated size·62 MB
                <div className="btn-stack">
                    <a className="btn rounded-btn">Home</a><br/>
                    <a className="btn rounded-btn">Account</a><br/>
                    <a className="btn rounded-btn">Tweets</a><br/>
                </div>
            </div>
            <div className="feed-col">
                { TWEET_SUBSET.map(tweet => {
                    return (<Tweet tweet={tweet.tweet}/>)})
                }
            </div>
            <div className="metadata-col">
                {/* Metadata */}
            </div>
        </div>
    );
}
