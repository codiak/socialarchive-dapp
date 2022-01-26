import { createContext, useContext, useEffect, useReducer } from "react";
import { convertBytesToString } from "./index";
import { get, set } from "idb-keyval";
import { Zip } from "../process/Zip";
import { Beejs } from "../process/Beejs";

const reducerActions = (state = initialState, action) => {
  console.log("action: ", action.type);
  switch (action.type) {
    case "PROCESS_ZIP_FILE":
      let file = action.payload;
      return {
        ...state,
        loading: true,
        error: false,
        zipFile: file,
        process: true,
      };
    case "UPLOAD_TO_SWARM":
      return {
        ...state,
        loading: true,
        error: false,
        pendingBackup: action.payload,
        progressCb: action.progressCb,
        upload: true,
      };
    case "UPLOAD_SUCCESS":
      return {
        ...state,
        upload: false,
        hash: action.hash,
        url: action.url,
        error: false,
      };
    case "UPLOAD_FAIL":
      return {
        ...state,
        upload: false,
        error: true,
        errorMessage: action.errorMessage,
      };
    case "DOWNLOAD_FAIL":
      return {
        ...state,
        download: false,
        error: true,
        errorMessage: action.errorMessage,
      };
    case "DOWNLOAD_FROM_SWARM":
      return {
        ...state,
        loading: true,
        hash: action.payload,
        progressCb: action.progressCb,
        error: false,
        download: true,
      };
    case "ARCHIVE_LOADED":
      console.log("archive: ", action.payload);
      return {
        ...state,
        loading: false,
        error: false,
        pendingBackup: action.payload,
        zipFile: action.zipFile ? action.zipFile : null,
        process: false,
        upload: false,
        download: false,
      };
    case "LOADING":
      return { ...state, loading: true, error: false };
    case "ERROR":
      let msg = action.payload;
      // format the number into a human readable format
      let formatBytes = msg.substring(msg.indexOf("an") + 3, msg.indexOf("bytes"));
      msg = msg.replace(formatBytes + "bytes", convertBytesToString(formatBytes, 0)) + ". Please try again with a smaller file.";
      return { ...state, loading: false, error: true, errorMessage: msg };
    default:
      return state;
  }
};

const StoreContext = createContext({});

const initialState = {
  pendingBackup: {},
  zipFile: undefined,
  loading: false,
  error: false,
  process: false,
  upload: false,
};

const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducerActions, initialState);

  // loads files into state from idb if they exist
  useEffect(() => {
    const loadFromIdb = async () => {
      dispatch({ type: "LOADING" });
      let archive = await get("archive");
      dispatch({
        type: "ARCHIVE_LOADED",
        payload: archive ? archive : {},
      });
    };
    loadFromIdb();
  }, []);

  // unzips files - couldn't figure out another way to fire async dispatches using useReducer,
  useEffect(() => {
    if (state.process) {
      unzip(state.zipFile);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.process, state.zipFile]);

  // upload file to swarm,
  useEffect(() => {
    if (state.upload) {
      uploadToSwarm(state.pendingBackup, state.progressCb);
    }
  }, [state.upload, state.pendingBackup, state.progressCb]);

  // download file from swarm
  useEffect(() => {
    if (state.download) {
      downloadFromSwarm(state.hash, state.progressCb);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.download, state.hash, state.progressCb]);

  /*   */

  const unzip = async (zipFile) => {
    dispatch({ type: "LOADING" });
    let file = zipFile;
    let uzip = await Zip.unzip(file);
    //
    let zipDetails = {
      name: file.name,
      size: convertBytesToString(file.size),
      type: file.type,
      lastModifiedDate: file.lastModifiedDate.toString(),
    };

    // if unzip does not return any files, it means that the file is not a real twitter backup file
    if (Object.keys(uzip).length !== 0) {
      await saveToIdb("archive", uzip);
    }
    await saveToIdb("zipFile", zipDetails);
    dispatch({
      type: "ARCHIVE_LOADED",
      payload: uzip,
      zipFile: zipDetails,
    });
  };

  const saveToIdb = async (key, value) => {
    try {
      await set(key, value);
    } catch (e) {
      console.log("Error saving to idb: ", e);
    }
  };

  const uploadToSwarm = async (pendingBackup, progressCb) => {
    dispatch({ type: "LOADING" });

    let b = new Beejs();
    let result = await b.upload(pendingBackup, progressCb);
    console.log("hash", result);

    // response is an exception object :)
    if (result.message) {
      dispatch({
        type: "UPLOAD_FAIL",
        error: true,
        errorMessage: result.message,
      });
    } else {
      dispatch({
        type: "UPLOAD_SUCCESS",
        hash: result,
        url: `https://gateway.ethswarm.org/access/${result}`,
      });
    }
  };

  const downloadFromSwarm = async (hash, progressCb) => {
    let b = new Beejs();
    let result = await b.download(hash, progressCb);

    await saveToIdb("archive", result);

    // response is an exception object :)
    if (result.message) {
      dispatch({
        type: "DOWNLOAD_FAIL",
        error: true,
        errorMessage: result.message,
      });
    } else {
      dispatch({
        type: "ARCHIVE_LOADED",
        payload: result ? result : {},
      });
    }
  };

  return <StoreContext.Provider value={{ state, dispatch }}> {children} </StoreContext.Provider>;
};

const useStore = () => {
  const { state, dispatch } = useContext(StoreContext);
  return { state, dispatch };
};

export { StoreProvider, useStore };
