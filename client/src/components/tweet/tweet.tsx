import React from 'react';
import './tweet.css';
import AvatarCard from '../avatar-card/avatar-card';

export default function Timeline(props: any) {
    const { created_at, full_text, favorite_count, retweet_count, id } = props.tweet;
    const date = new Date(Date.parse(created_at)).toLocaleDateString();

    return (
        <div className="tweet-card">
            <AvatarCard hideBio={true}/>
            <span className="tweet-date">{date}</span>
            <p className="tweet-text">{full_text}</p>
        </div>
    );
}
