import React from 'react';
import { Link } from 'react-router-dom';

export default function ArchiveAccount(props: { backup: any }) {
    const { account, profile, following, follower, tweet } = props.backup;
    const { username, accountDisplayName } = account;
    const { description } = profile;
    const followingCount = following.length;
    const followersCount = follower.length;

    return (<>
        <div className="row">
            <h3>Username</h3>
            {username}
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
            {description["website"]}
        </div>
        <div className="row">
            <h3>Location</h3>
            {description["location"]}
        </div>
        <div className="row">
            <h3>Tweets</h3>
            <Link to={`/archive/${username}/tweets`}>{tweet.length}</Link>
        </div>
        <div className="row">
            <h3>Followers</h3>
            {followersCount}
        </div>
        <div className="row">
            <h3>Following</h3>
            {followingCount}
        </div>
    </>)
};
