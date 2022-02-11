import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useStore } from "../../utils/store";
import AvatarCard from "../avatar-card/avatar-card";

export default function BrowsePage() {
  let { section } = useParams();
  const page = section || "explore";
  const {
    state: { feeds, downloadingFeeds, error, errorMessage },
    dispatch,
  } = useStore();
  // eslint-disable-next-line
  const [itemsPerPage, setItemsPerPage] = useState(3);

  useEffect(
    () => {
      dispatch({ type: "GET_FEEDS_FROM_SWARM", itemsPerPage });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const recentAccounts: ArchivedAccount[] = feeds;

  return (
    <div className="container">
      <Helmet>
        <title>Browse - Social Archive</title>
      </Helmet>
      <div className="col">
        {page === "explore" && (
          <>
            <h2 className="col-header">Recently Added</h2>
            {downloadingFeeds && <div>Downloading...</div>}
            {error && errorMessage.length > 0 && <div className="archive-pending-error">{errorMessage}</div>}
            {recentAccounts &&
              recentAccounts.length > 0 &&
              !error &&
              recentAccounts.map((account, i) => {
                return (
                  <a key={i} href={"/archive/" + account.swarmHash}>
                    <AvatarCard archivedAccount={account} isUserRow={true} />
                  </a>
                );
              })}
          </>
        )}
      </div>
      <div className="col">
        <h2 className="col-header">Find Account</h2>
      </div>
    </div>
  );
}

export interface ArchivedAccount {
  timestamp: number;
  username: string;
  isArchived: boolean;
  accountDisplayName: string;
  description: {
    bio: string;
    website?: string;
    location?: string;
  };
  avatarMediaUrl: string;
  swarmHash?: string;
  archiveDate?: string;
  archiveSize?: string;
}
