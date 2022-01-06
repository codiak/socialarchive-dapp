import React from 'react';
import './archive-account-list.css';

export default function ArchiveAccountList(props: { accounts: Account[], title: string }) {
    const {accounts, title} = props;

    return (<>
        <h2 className="list-title">{title}</h2>
        { accounts.map((account: Account) => {
            return (<div className="account-card">
              <div>
                <div className="default-avatar">
                    <img className="icon-avatar" src="/icons/avatar.svg" alt="Avatar"/>
                </div>
                {account.accountId}
              </div>
              <a className="like-link" href={account.userLink} target="_blank" rel="noreferrer">
                  View on Twitter
                  <img className="icon-link" src="/icons/link.svg" alt="Open Link"/>
              </a>
            </div>);
          })}
    </>)
};

export interface Account {
    accountId: string,
    userLink: string
}
