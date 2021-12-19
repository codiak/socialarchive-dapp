import React from "react";
import { useDropzone } from "react-dropzone";
import { useStore } from "../../utils/store";

function Upload() {
  // our faithful state management
  const {
    state: { zipFile, unZippedFiles, loading, error, errorMessage },
    dispatch,
  } = useStore();
  const ZIP_MIME_TYPE = "application/zip";

  const onDrop = async (files: any[]) => {
    if (files.length > 0) {
      let file = files[0];
      console.log("File on drop: ", file);
      if (file.type === ZIP_MIME_TYPE) {
        dispatch({ type: "SET_ZIP_FILE", payload: file });
      }
    }
  };

  const onDropRejected = async (rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      let file = rejectedFiles[0].file;
      if (file.type === ZIP_MIME_TYPE) {
        dispatch({ type: "ERROR", payload: rejectedFiles[0].errors[0].message });
      }
    }
  };

  // options for dropzone, disable mutliple files and accept only zip files
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: ZIP_MIME_TYPE,
    onDrop: onDrop,
    maxSize: 1e9, // 1GB
    onDropRejected: onDropRejected,
  });

  return (
    <div>
      <section>
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          {zipFile ? "Drag and drop or select another file" : "Drag and drop or select a file"}
        </div>
      </section>
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
