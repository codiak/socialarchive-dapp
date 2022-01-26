import { useEffect, useState } from "react";
import { useStore } from "../../utils/store";
import { useParams, Navigate } from "react-router-dom";
import { convertBytesToString } from "../../utils/";

import ProgressBar from "../progressbar/progressbar";
import loader from "../../loading-14.gif";

export default function ArchiveDownload() {
  const { id } = useParams();
  const {
    state: { pendingBackup, hash, download, error, errorMessage },
    dispatch,
  } = useStore();
  const [progress, setProgress] = useState("");

  const logProgress = (input: any) => {
    const { loaded, total } = input;
    setProgress(convertBytesToString(input.loaded));
  };

  useEffect(() => {
    if (id !== undefined && id.length === 64) {
      dispatch({ type: "DOWNLOAD_FROM_SWARM", payload: id, progressCb: logProgress });
    }
  }, [id, dispatch]);

  return (
    <div>
      <svg className="spinner" viewBox="0 0 50 50">
        <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5" />
      </svg>
      {/* can you please center and put them under the spinner? */}
      {progress}
      {/* hide spinner and request user to paste swarm hash? */}
      {error && errorMessage}
      {/* {Object.keys(pendingBackup).length > 0 && (
        <>
          <Navigate to="/archive/pending/home" />
        </>
      )} */}
    </div>
  );
}
