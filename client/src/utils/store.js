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
        username: action.username,
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
      // let zipFile = await get("zipFile");
      // if (zipFile !== undefined) {
      dispatch({ type: "LOADING" });
      let archive = await get("archive");
      dispatch({
        type: "ARCHIVE_LOADED",
        payload: archive ? archive : {},
        // zipFile: zipFile,
      });
      // }
    };
    loadFromIdb();
  }, []);

  // unzips files - couldn't figure out another way to fire async dispatches using useReducer,
  useEffect(() => {
    const unZip = async () => {
      dispatch({ type: "LOADING" });
      let file = state.zipFile;
      let uzip = await Zip.unzip(file);
      let zipDetails = {
        name: file.name,
        size: convertBytesToString(file.size),
        type: file.type,
        lastModifiedDate: file.lastModifiedDate.toString(),
      };

      // if unzip does not return any files, it means that the file is not a real twitter backup file
      if (Object.keys(uzip).length !== 0) {
        await set("archive", uzip);
      }
      await set("zipFile", zipDetails);
      dispatch({
        type: "ARCHIVE_LOADED",
        payload: uzip,
        zipFile: zipDetails,
      });
    };
    if (state.process) {
      unZip();
    }
  }, [state.process, state.zipFile]);

  // upload file to swarm,
  useEffect(() => {
    const uploadSwarm = async () => {
      dispatch({ type: "LOADING" });

      let b = new Beejs();
      let result = await b.upload(state.pendingBackup, state.progressCb);
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
    if (state.upload) {
      uploadSwarm();
    }
  }, [state.upload, state.pendingBackup, state.progressCb]);
  //   const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return <StoreContext.Provider value={{ state, dispatch }}> {children} </StoreContext.Provider>;
};

const useStore = () => {
  const { state, dispatch } = useContext(StoreContext);
  return { state, dispatch };
};

export { StoreProvider, useStore };
