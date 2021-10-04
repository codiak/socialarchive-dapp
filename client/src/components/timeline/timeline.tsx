import React from 'react';
import './timeline.css';
import { TWEET_SUBSET } from '../../data/tweet-subset';

export default function Timeline() {


    return (
    <div className="timeline">
        { TWEET_SUBSET.map(tweet => {
            return (<div className="tweet-block" key={tweet.tweet.id}>
                {tweet.tweet.full_text}
            </div>)})
        }
    </div>);
}
