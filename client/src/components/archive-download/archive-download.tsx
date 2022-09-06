import { useEffect, useState } from "react";
import { useStore } from "../../utils/store";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useParams, Navigate } from "react-router-dom";
import { convertBytesToString } from "../../utils/";
import Spinner from "../spinner/spinner";

export default function ArchiveDownload() {
  const { id } = useParams();
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    state: { pendingBackup, error, errorMessage },
    dispatch,
  } = useStore();
  const [progress, setProgress] = useState("");

  const logProgress = (input: any) => {
    setProgress(convertBytesToString(input.loaded));
  };

  useEffect(() => {
    if (id !== undefined && id.length === 64) {
      dispatch({ type: "DOWNLOAD_FROM_SWARM", payload: id, progressCb: logProgress });
    }
  }, [id, dispatch]);

  return (
    <div>
      <div className="center-flex-wrap">
        <Spinner label={progress} />
      </div>
      {/* hide spinner and request user to paste swarm hash? */}
      {error && errorMessage}
      {Object.keys(pendingBackup).length > 0 &&
        pendingBackup["hash"] &&
        pendingBackup["hash"] === id && (
          <>
            <Navigate to={"/archive/" + id + "/home"} />
          </>
        )}
    </div>
  );
}
