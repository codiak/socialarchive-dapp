import { useDropzone } from "react-dropzone";
import { useStore } from "../../utils/store";
import { useNavigate } from "react-router-dom";

const DropZone = ({ zipFile }: any) => {
  let navigate = useNavigate();

  const { dispatch } = useStore();

  const ZIP_MIME_TYPE = "application/zip";

  const onDrop = async (files: any[]) => {
    if (files.length > 0) {
      let file = files[0];
      console.log("File on drop: ", file);
      if (file.type === ZIP_MIME_TYPE) {
        dispatch({ type: "PROCESS_ZIP_FILE", payload: file });
      }
      navigate("/archive/pending/home");
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

  // options for dropzone, disable mutliple files, accept only zip files and set max size to 1GB
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: ZIP_MIME_TYPE,
    onDrop: onDrop,
    maxSize: 1e9, // 1GB
    onDropRejected: onDropRejected,
  });

  return (
    <section>
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        {zipFile ? (
          "Drag and drop or select another archive"
        ) : (
          <>
            <p>
              Drag and drop or select zipped Twitter archive
              <br />
              <br />
              <i>eg. twitter-2021-11-04-..f918.zip</i>
            </p>
          </>
        )}
      </div>
    </section>
  );
};

export default DropZone;
