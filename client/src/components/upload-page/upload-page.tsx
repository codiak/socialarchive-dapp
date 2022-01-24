import React from "react";
import { useStore } from "../../utils/store";
import Dropzone from "./DropZone";
import "./dropzone.css";

function UploadPage() {
  // our faithful state management
  const {
    state: { zipFile, pendingBackup, loading, error, errorMessage },
  } = useStore();

  return (
    <div className="upload-page">
      <div>
        <h3>Upload Twitter archive to begin</h3>
      </div>
      <Dropzone />
      {error && <div style={{ color: "red" }}>Error: {errorMessage}</div>}
      {loading && <div>Loading...</div>}
      {!loading && zipFile && (
        <>
          {Object.keys(pendingBackup).length === 0 && (
            <>
              <div style={{ color: "red" }}>This file does not contain any twitter backup data</div>
              Filename: {zipFile.name}
              <br />
              Size: {zipFile.size}
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
