import { createContext, useContext, useEffect, useReducer } from "react";
import { convertBytesToString, getFromIdb, saveToIdb, getFeedsCache } from "./index";
import { Zip } from "../process/Zip";
import { Beejs } from "../process/Beejs";

const reducerActions = (state = initialState, action) => {
  const { type, payload } = action;
  console.log("action: ", type);
  switch (type) {
    case "PROCESS_ZIP_FILE":
      return {
        ...state,
        loading: true,
        error: false,
        zipFile: payload,
        process: true,
      };
    case "UPLOAD_TO_SWARM":
      return {
        ...state,
        loading: true,
        error: false,
        pendingBackup: payload,
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
    case "GET_FEEDS_FROM_SWARM":
      return {
        ...state,
        loading: true,
        error: false,
        itemsPerPage: action.itemsPerPage,
        downloadingFeeds: true,
      };
    case "FEEDS_LOADED":
      console.log("feeds: ", payload);
      return {
        ...state,
        loading: false,
        error: false,
        downloadingFeeds: false,
      };
    case "FEEDS_LOADED_FROM_CACHE":
      console.log("feeds: ", payload);
      return {
        ...state,
        loading: false,
        error: false,
        downloadingFeeds: false,
        feeds: payload,
      };
    case "FEED_ITEM_LOADED":
      return {
        ...state,
        loading: false,
        error: false,
        feeds: action.delta ? [payload, ...state.feeds.reverse()] : [...state.feeds, payload],
        downloadingFeeds: true,
      };
    case "FEEDS_DOWNLOAD_FAIL":
      return {
        ...state,
        downloadingFeeds: false,
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
        hash: payload,
        progressCb: action.progressCb,
        error: false,
        download: true,
      };
    case "ARCHIVE_LOADED":
      console.log("archive: ", payload);
      const { zipFile = null } = action;
      return {
        ...state,
        loading: false,
        error: false,
        pendingBackup: payload,
        zipFile,
        process: false,
        upload: false,
        download: false,
      };
    case "LOADING":
      return { ...state, loading: true, error: false };
    case "ERROR":
      let msg = payload;
      // format the number into a human readable format
      let formatBytes = msg.substring(msg.indexOf("an") + 3, msg.indexOf("bytes"));
      msg =
        msg.replace(formatBytes + "bytes", convertBytesToString(formatBytes, 0)) +
        ". Please try again with a smaller file.";
      return { ...state, loading: false, error: true, errorMessage: msg };
    default:
      return state;
  }
};

const StoreContext = createContext({});

const initialState = {
  pendingBackup: { archiveItems: {}, mediaMap: {} },
  pendingBackupSize: 0,
  zipFile: undefined,
  loading: false,
  error: false,
  process: false,
  upload: false,
  delta: false,
  feeds: [],
};

const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducerActions, initialState);

  // loads files into state from idb if they exist
  useEffect(() => {
    const loadFromIdb = async () => {
      dispatch({ type: "LOADING" });
      let archive = await getFromIdb("archive");
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

  // get feeds from swarm
  useEffect(
    () => {
      if (state.downloadingFeeds) {
        downloadFeedsFromSwarm(state.itemsPerPage);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.downloadingFeeds]
  );

  const unzip = async (zipFile) => {
    dispatch({ type: "LOADING" });
    let file = zipFile;
    let uzip = await Zip.unzip(file);
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
        gatewayUrl: `https://gateway.ethswarm.org/access/${result}`,
      });
    }
  };

  const downloadFromSwarm = async (hash, progressCb) => {
    let b = new Beejs();
    let result = await b.download(hash, progressCb);
    console.log("downloaded: ", result);

    await saveToIdb("archive", result);

    // response is an exception object :)
    if (result.message) {
      dispatch({
        type: "DOWNLOAD_FAIL",
        error: true,
        errorMessage: result.message,
      });
    } else {
      result["hash"] = hash;
      dispatch({
        type: "ARCHIVE_LOADED",
        payload: result ? result : {},
      });
    }
  };

  const downloadFeedsFromSwarm = async (itemsPerPage) => {
    let b = new Beejs();

    try {
        const { cachedFeedIndex, cachedFeeds } = await getFeedsCache();
        dispatch({
          type: "FEEDS_LOADED_FROM_CACHE",
          payload: cachedFeeds.reverse(),
        });
        const feedIndex = await b.getFeedIndex();
        const numFeedsToFetch = cachedFeeds.length ? feedIndex - cachedFeedIndex : itemsPerPage;
        await b.getFeeds(feedIndex, numFeedsToFetch, dispatch, cachedFeeds);
        dispatch({
          type: "FEEDS_LOADED",
        });
      } catch (error) {
        dispatch({
          type: "FEEDS_DOWNLOAD_FAIL",
          error: true,
          errorMessage: error.message,
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
