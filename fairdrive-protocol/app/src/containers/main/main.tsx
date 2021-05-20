import React from "react";
import useStyles from "./mainStyles";

import FileCard from "../../components/fileCard/fileCard";

export interface Props {}

export default function Main(props: Props) {
  const classes = useStyles();
  return (
    <div className={classes.Main}>
      <FileCard file={{}} setFile={{}}></FileCard>
    </div>
  );
}
