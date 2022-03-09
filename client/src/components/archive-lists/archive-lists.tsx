import React from "react";
import "./archive-lists.css";

export default function ArchiveLists(props: { lists: List[] }) {
  const lists = props.lists;
  const noneCreated = !lists || lists.length < 1;

  if (noneCreated) {
    return (
      <div>
        <div className="heading-row">
          <h3>Lists</h3>
        </div>
        <div className="row fill-message">No Lists created.</div>
      </div>
    );
  }

  return (
    <>
      <div className="heading-row">
        <h3>Lists</h3>
      </div>
      {lists.map((list) => {
        const urlSplit = list.url.split("/");
        const listId = urlSplit[urlSplit.length - 1];
        return (
          <div className="list-card">
            {listId}
            <br />
            <a target="_blank" href={list.url} rel="noreferrer">
              View List
              <img className="icon-link" src="/icons/link.svg" alt="Open Link" />
            </a>
          </div>
        );
      })}
    </>
  );
}

interface List {
  url: string;
}
