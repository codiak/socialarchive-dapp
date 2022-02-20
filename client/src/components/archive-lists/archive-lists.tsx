import React from "react";
import "./archive-lists.css";

export default function ArchiveLists(props: { lists: any[] }) {
  const lists = props.lists;

  return <>{!lists && <h3>No lists created at time of archive</h3>}</>;
}
