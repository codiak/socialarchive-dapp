import React from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import AvatarCard from "../avatar-card/avatar-card";

export default function BrowsePage() {
  let { section } = useParams();
  const page = section || "explore";
  const recentAccounts: ArchivedAccount[] = [
    {
      username: "cybercody",
      accountDisplayName: "Cody",
      description: {
        bio: "Programmer on Social Archive",
      },
      avatarMediaUrl: "https://pbs.twimg.com/profile_images/1404544885324189697/wzv9wUaO_200x200.jpg",
      swarmHash: "abcEXAMPLE123",
      archiveDate: "Tue Feb 23 02:21:09 +0000 2021",
    },
  ];

  return (
    <div className="container">
      <Helmet>
        <title>Browse - Social Archive</title>
      </Helmet>
      <div className="col">
        {page === "explore" && (
          <>
            <h2 className="col-header">Recently Added</h2>
            {recentAccounts.map((account) => {
              return (
                <a href={"/archive/" + account.username + "/tweets"}>
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
  username: string;
  accountDisplayName: string;
  description: {
    bio: string;
    website?: string;
    location?: string;
  };
  avatarMediaUrl: string;
  swarmHash?: string;
  archiveDate?: string;
}
