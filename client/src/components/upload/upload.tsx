import React from "react";
import { useStore } from "../../utils/store";
import Dropzone from "./DropZone";

function Upload() {
  // our faithful state management
  const {
    state: { zipFile, unZippedFiles, loading, error, errorMessage },
  } = useStore();

  return (
    <div>
      <Dropzone />
      {error && <div style={{ color: "red" }}>Error: {errorMessage}</div>}
      {loading && <div>Loading...</div>}
      {!loading && zipFile && (
        <>
          Filename: {zipFile.name}
          <br />
          Last modified date: {zipFile.lastModifiedDate}
          <br />
          Size: {zipFile.size}
          <br />
          {unZippedFiles.length > 0 ? (
            <>
              Total files in backup: {unZippedFiles.length}
              <div className="card">
                <div className="card-header">List of Files</div>
                <ul className="list-group list-group-flush">
                  {unZippedFiles.map((item: any, i: React.Key) => (
                    <li className="list-group-item" key={i}>
                      {/* @ts-ignore */}
                      {item.name} | {item.type}
                      {item.type === "mp4" ? (
                        <video autoPlay loop controls>
                          <source type="video/mp4" src={item.data} />
                        </video>
                      ) : (
                        item.type !== "json" && <img src={item.data} alt={item.type} />
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            "This file does not contain any twitter backup data"
          )}
        </>
      )}
    </div>
  );
}

export default Upload;
