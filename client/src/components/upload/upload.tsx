import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { convertBytesToString } from "../../util";
import { Zip } from "../../process/Zip";

function Upload() {
  const [selectedFile, setSelectedFile] = useState<any>(undefined);
  const [unZippedFiles, setUnZippedFiles] = useState<any>([]);
  const [currentFile] = useState<any>(undefined);
  const [progress] = useState<any>(0);
  const [message] = useState<any>("");

  const onDrop = async (files: any) => {
    if (files.length > 0) {
      // we only support one file at the moment
      let file = files[0];
      console.log("file on drop: ", file);
      setSelectedFile(file);
      if (file.type === "application/zip") {
        let unzippedFiles = await Zip.unzip(file);
        console.log("unzipped files: ", unzippedFiles);
        setUnZippedFiles(unzippedFiles);
      }
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false, // we only support one file at the moment
    accept: "application/zip",
    onDrop: onDrop,
  });

  return (
    <div>
      {currentFile && (
        <div className="progress mb-3">
          <>
            <div className="progress-bar progress-bar-info progress-bar-striped" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} style={{ width: progress + "%" }}>
              {progress}%
            </div>
          </>
        </div>
      )}
      <section>
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          {selectedFile && selectedFile.name ? "Drag and drop or select another file" : "Drag and drop or select a file"}
        </div>
      </section>
      <div className="alert alert-light" role="alert">
        {message}
      </div>
      {unZippedFiles.length > 0 ? (
        <>
          Filename: {selectedFile.name}
          <br />
          Size: {convertBytesToString(selectedFile.size)}
          <br />
          Total files in backup: {unZippedFiles.length}
          <div className="card">
            <div className="card-header">List of Files</div>
            <ul className="list-group list-group-flush">
              {unZippedFiles &&
                unZippedFiles.length &&
                unZippedFiles.map((item: any, i: React.Key) => (
                  <li className="list-group-item" key={i}>
                    {/* @ts-ignore */}
                    {item.name} | {item.type}
                  </li>
                ))}
            </ul>
          </div>
        </>
      ) : (
        selectedFile && (
          <>
            Filename: {selectedFile.name}
            <br />
            Size: {convertBytesToString(selectedFile.size)}
            <br />
            This is not a valid twitter backup file, please select a valid zip file{" "}
          </>
        )
      )}
    </div>
  );
}

export default Upload;
