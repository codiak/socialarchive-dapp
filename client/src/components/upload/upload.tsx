import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { convertBytesToString } from "../../util";
import { Zip } from "../../process/Zip";

function Upload() {
  const [selectedFile, setSelectedFile] = useState<any>(undefined);
  const [unZippedFiles, setUnZippedFiles] = useState<any>([]);
  const [extracting, setExtracting] = useState<any>(false);
  const ZIP_MIME_TYPE = "application/zip";

  const onDrop = async (files: any[]) => {
    if (files.length > 0) {
      let file = files[0];
      console.log("File on drop: ", file);
      setSelectedFile(file);
      if (file.type === ZIP_MIME_TYPE) {
        setExtracting(true); // TODO use this to add spinner when loading huge files
        let unzippedFiles = await Zip.unzip(file);
        setExtracting(false);
        console.log("Unzipped files: ", unzippedFiles);
        setUnZippedFiles(unzippedFiles);
      }
    }
  };

  // group data by file type
  const groupBy = (xs: any, key: any) => {
    return xs.reduce((rv: any, x: any) => {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
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
          {selectedFile && selectedFile.name ? "Drag and drop or select another file" : "Drag and drop or select a file"}
        </div>
      </section>
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
                    {item.type === "mp4" ? (
                      <video controls>
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
        selectedFile && (
          <>
            Filename: {selectedFile.name}
            <br />
            Size: {convertBytesToString(selectedFile.size)}
            <br />
            {!extracting && "This is not a valid twitter backup file, please select a valid zip file"}
          </>
        )
      )}
    </div>
  );
}

export default Upload;
