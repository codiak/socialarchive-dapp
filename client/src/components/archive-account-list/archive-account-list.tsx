import React from "react";
import Paginate from "../paginate/paginate";
import { useSearchParams } from "react-router-dom";
import "./archive-account-list.css";


export default function ArchiveAccountList(props: { accounts: Account[]; title: string }) {
  const { accounts, title } = props;
  const [searchParams] = useSearchParams();
  const page: number = parseInt(searchParams.get("page")) || 1;
  const size: number = parseInt(searchParams.get("size")) || 1;
  const cursor = (page - 1) * size;
  const pageAccounts = accounts.slice(cursor, cursor + size);

  return (
    <>
      <div className="heading-row">
        <h3 className="list-title">{title}</h3>
      </div>
      {pageAccounts.map((account: Account) => {
        return (
          <div className="account-card" key={account.accountId}>
            <div>
              <div className="default-avatar">
                <img className="icon-avatar" src="/icons/avatar.svg" alt="Avatar" />
              </div>
              {account.accountId}
            </div>
            <a className="like-link" href={account.userLink} target="_blank" rel="noreferrer">
              View on Twitter
              <img className="icon-link" src="/icons/link.svg" alt="Open Link" />
            </a>
          </div>
        );
      })}
      <Paginate itemCount={accounts.length} />
    </>
  );
}

export interface Account {
  accountId: string;
  userLink: string;
}
