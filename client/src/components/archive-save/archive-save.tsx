import "./archive-save.css";
import "../../data/archive.tsx";
import { useState } from "react";
import { useStore } from "../../utils/store";
import ProgressBar from "../progressbar/progressbar";

export default function ArchiveSave() {
  const {
    state: { pendingBackup, hash, upload, url, error, errorMessage },
    dispatch,
  } = useStore();

  const [progress, setProgress] = useState(0);

  function logProgress(input: any): void {
    const { loaded, total } = input;
    const percent = Math.floor((loaded / total) * 100);
    console.log(`progress: ${percent}%`);
    setProgress(percent);
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch({ type: "UPLOAD_TO_SWARM", payload: pendingBackup, progressCb: logProgress });
  };

  let previewOrBackup = hash && hash.length > 0 ? "Saved" : "Preview";
  // let furl = `https://gateway.ethswarm.org/access/${hash}`;

  const divStyle = {
    color: hash && hash.length > 0 ? "green" : "#CB8554",
  };
  let copy = hash && hash.length > 0 ? "Backed up to Swarm" : "Not yet backed up to Swarm.";

  return (
    <div className="archive-pending-label">
      <div style={divStyle}>
        <form onSubmit={handleSubmit}>
          <b>
            Archive {previewOrBackup} {pendingBackup && pendingBackup.bsize && "(" + pendingBackup.bsize + ")"}
          </b>
          <p></p>
          <p>{copy}</p>
          {/* {upload && ( */}
          <ProgressBar bgcolor={"#00695c"} completed={progress} />
          <br />
          <div>
            {hash && hash.length > 0 ? (
              <a href={url} rel="noreferrer" className="link-button" target="_blank">
                Swarm Hash
              </a>
            ) : !upload ? (
              <div className="btn-row">
                <input type="submit" className="btn secondary" value="Confirm" />
                {/* TODO: | Cancel btn to clear local copy/IndexDB */}
              </div>
            ) : (
              "Uploading..."
            )}
            {error && errorMessage.length > 0 && <p style={{ color: "red" }}>{errorMessage}</p>}
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
