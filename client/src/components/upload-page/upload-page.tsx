import { useStore } from "../../utils/store";
import Dropzone from "./DropZone";
import "./dropzone.css";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../auth/authModule.js";

function UploadPage() {
  const navigate = useNavigate();

  // our faithful state management
  const {
    state: {
      privateUpload,
      zipFile,
      pendingBackup: { archiveItems },
      loading,
      error,
      errorMessage,
    },
    dispatch,
  } = useStore();

  return (
    <div className="upload-page">
      <div>
        <h3>Upload Twitter archive to begin</h3>
      </div>
      <Dropzone loading={loading} />
      {error && <div style={{ color: "red" }}>Error: {errorMessage}</div>}
      {!loading && zipFile && (
        <>
          {Object.keys(archiveItems).length === 0 ? (
            <>
              <div style={{ color: "red" }}>This file does not contain any twitter backup data</div>
              Filename: {zipFile.name}
              <br />
              Size: {zipFile.size}
            </>
          ) : isLoggedIn() === true ? (
            <>
              <p>This archive is public. would you like to make it private?</p>
              <label className="checkbox-group">
                <input
                  className="checkbox-group--checkbox"
                  type="checkbox"
                  onClick={() =>
                    privateUpload
                      ? dispatch({ type: "PRIVATE_UPLOAD_FALSE" })
                      : dispatch({ type: "PRIVATE_UPLOAD" })
                  }
                />
                <span className="checkbox-group--label">Yes. Make my archive private</span>
              </label>

              <button className="btn primary" onClick={() => navigate("/archive/pending/home")}>
                Continue
              </button>
            </>
          ) : (
            <>
              <p>
                This archive will be uploaded publicly. Login if you would like to make it private.
              </p>

              <button className="btn primary" onClick={() => navigate("/archive/pending/home")}>
                Continue
              </button>
            </>
          )}
        </>
      )}
      <div>
        <h3>Need your Twitter archive?</h3>

        <div className="step-wrap">
          <div className="step-block">
            <p>1. Access Twitter settings</p>
            <img src="step1-settings.gif" alt="step 1" />
          </div>
          <div className="step-block">
            <p>2. Request archive</p>
            <img src="step2-request.gif" alt="step 2" />
          </div>
        </div>
        <div className="step-wrap">
          <div className="step-block">
            <p>
              3. Wait for email confirmation <br />
              <span className="econf">Typically within 24 hours</span>
            </p>
            <img src="step3-waitforemail.png" alt="step 3" />
          </div>
          <div className="step-block">
            <p>
              4. Download archive <br />
              <span className="econf">Expires in 7 days!</span>
            </p>
            <img src="step4-download.gif" alt="step 4" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadPage;
