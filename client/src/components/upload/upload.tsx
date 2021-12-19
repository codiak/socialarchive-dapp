import React from "react";
import { useDropzone } from "react-dropzone";
import { useStore } from "../../utils/store";

function Upload() {
  // our faithful state management
  const { state, dispatch } = useStore();
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

  // options for dropzone, disable mutliple files and accept only zip files
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: ZIP_MIME_TYPE,
    onDrop: onDrop,
  });

  return (
    <div>
      <section>
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          {state.zipFile && state.zipFile ? "Drag and drop or select another file" : "Drag and drop or select a file"}
        </div>
      </section>
      {state.loading && <div>Loading...</div>}
      {!state.loading && state.zipFile && (
        <>
          Filename: {state.zipFile.name}
          <br />
          Size: {state.zipFile.size}
          <br />
          {state.unZippedFiles.length > 0 ? (
            <>
              Total files in backup: {state.unZippedFiles.length}
              <div className="card">
                <div className="card-header">List of Files</div>
                <ul className="list-group list-group-flush">
                  {state.unZippedFiles.map((item: any, i: React.Key) => (
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
