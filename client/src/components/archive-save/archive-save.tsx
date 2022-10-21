import "./archive-save.css";
import "../../data/archive.tsx";
import { useState } from "react";
import { useStore } from "../../utils/store";

import ProgressBar from "../progressbar/progressbar";

export default function ArchiveSave() {
  const {
    state: { privateUpload, pendingBackup, hash, upload, gatewayUrl, error, errorMessage },
    dispatch,
  } = useStore();
  const { archiveSize } = pendingBackup;

  const [progress, setProgress] = useState(0);

  const logProgress = (input: any) => {
    const { loaded, total } = input;
    const percent = Math.floor((loaded / total) * 100);
    console.log(`progress: ${percent}%`);
    setProgress(percent);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch({ type: "UPLOAD_TO_SWARM", payload: pendingBackup, progressCb: logProgress });
  };

  let previewOrBackup = hash && hash.length > 0 ? "Saved" : "Preview";

  const divStyle = {
    color: hash && hash.length > 0 ? "green" : "#CB8554",
  };
  const copy = hash && hash.length > 0 ? "Backed up to Swarm" : "Not yet backed up to Swarm.";
  const viewUrl = "/archive/" + hash;
  const displayHash = () => {
    return (
      <div className="btn-row">
        <a href={viewUrl} rel="noreferrer" className="link-button" target="_blank">
          Open to Verify
        </a>
        &nbsp;|&nbsp;
        <a href={gatewayUrl} rel="noreferrer" className="link-button" target="_blank">
          Swarm Hash
        </a>
      </div>
    );
  };

  return (
    <div className="archive-pending-label">
      <div style={divStyle}>
        <form onSubmit={handleSubmit}>
          <b>
            Archive {previewOrBackup} ({archiveSize})
          </b>
          <p></p>
          <p>{copy}</p>

          {privateUpload && <p>This archive will be uploaded privately</p>}
          {!privateUpload && <p>This archive will be public</p>}

          {/* {upload && ( */}
          <ProgressBar bgcolor={"#00695c"} completed={progress} />
          <br />
          <div className="archive-pending-action">
            {hash && hash.length > 0 ? (
              displayHash()
            ) : !upload ? (
              <div className="btn-row">
                <input type="submit" className="btn secondary" value="Confirm" />
                {/* TODO: | Cancel btn to clear local copy/IndexDB */}
              </div>
            ) : (
              "Uploading..."
            )}
            {error && errorMessage.length > 0 && (
              <div className="archive-pending-error">{errorMessage}</div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export interface Archive {
  expandedUrl: string;
  fullText: string;
  tweetId: string;
}
