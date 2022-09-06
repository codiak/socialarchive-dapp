import "./avatar-card.css";
import { useStore } from "../../utils/store";

export default function AvatarCard(props: any) {
  const {
    state: {
      pendingBackup: { mediaMap },
    },
  } = useStore();
  const { hideBio, date, tweetId, archivedAccount, archivedProfile, isUserRow } = props;
  const { username, accountDisplayName } = archivedAccount;
  let avatarMediaUrl = undefined;
  let description = undefined;
  // from upload page - shows data from the uploaded profile
  if (archivedProfile) {
    avatarMediaUrl = archivedProfile.avatarMediaUrl;
    description = archivedProfile.description;
  }
  // from browse page - shows data from feeds
  else {
    avatarMediaUrl = archivedAccount.avatarMediaUrl;
    description = archivedAccount.description;
  }

  const mediaDataUrl = (mediaUrl) => {
    if (mediaUrl.startsWith("data")) {
      return mediaUrl;
    }
    const mediaId = mediaUrl.substring(mediaUrl.lastIndexOf("/") + 1, mediaUrl.length);
    const dataUrl = mediaMap[mediaId] || ""; // TODO: default back to mediaUrl
    return dataUrl;
  };

  const bio = description?.bio;
  const cardStyles = ["card", isUserRow ? "card-user-row" : ""].join(" ");
  return (
    <>
      <div className={cardStyles}>
        <img alt="User Icon" className="avatar-img" src={mediaDataUrl(avatarMediaUrl || "")} />
        <div className="account-name">
          {accountDisplayName}
          <div className="account-handle">@{username}</div>
          {date && (
            <div className="tweet-date">
              &nbsp;•&nbsp;
              <a
                href={"https://twitter.com/" + username + "/status/" + tweetId}
                target="_blank"
                rel="noreferrer"
              >
                {date}
              </a>
            </div>
          )}
        </div>
      </div>
      {!hideBio && <p className="account-bio">{bio}</p>}
    </>
  );
}
