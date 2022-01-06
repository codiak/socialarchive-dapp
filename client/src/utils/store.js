import { createContext, useContext, useEffect, useReducer } from "react";
import { convertBytesToString } from "./index";
import { get, set } from "idb-keyval";
import { Zip } from "../process/Zip";

const reducerActions = (state = initialState, action) => {
  console.log("action: ", action.type);
  switch (action.type) {
    case "SET_ZIP_FILE":
      let file = action.payload;
      return {
        ...state,
        loading: true,
        error: false,
        zipFile: file,
        process: true,
      };
    case "UNZIPPED_FILES_LOADED":
      /** Build reference object
         * todo: finalize format
         */
       let pendingBackup = {};
       action.payload.forEach((f) => {
        if (['tweet.js', 'like.js', 'following.js', 'follower.js', 'mute.js', 'block.js'].includes(f.name)) {
          // Handle nested arrays
          let name = Object.keys(f.data[0])[0];
          let flattenedArray = [];
          f.data.forEach((item) => {
            flattenedArray.push(item[name]);
            // item.entries().forEach((key, value) => {
            //   if (!name) name = key;
            //   flattenedArray.push(value);
            // });
          });
          pendingBackup = Object.assign(pendingBackup, { [name]: flattenedArray });
        } else {
          pendingBackup = Object.assign(pendingBackup, f.data[0]);
        }
       });
      return {
        ...state,
        loading: false,
        error: false,
        unZippedFiles: action.payload,
        pendingBackup: pendingBackup,
        zipFile: action.zipFile,
        process: false,
      };
    case "LOADING":
      return { ...state, loading: true, error: false };
    case "ERROR":
      let msg = action.payload;
      // format the number into a human readable format
      let formatBytes = msg.substring(
        msg.indexOf("an") + 3,
        msg.indexOf("bytes")
      );
      msg =
        msg.replace(
          formatBytes + "bytes",
          convertBytesToString(formatBytes, 0)
        ) + ". Please try again with a smaller file.";
      return { ...state, loading: false, error: true, errorMessage: msg };
    default:
      return state;
  }
};

const StoreContext = createContext({});

const initialState = {
  unZippedFiles: [],
  pendingBackup: {},
  zipFile: undefined,
  loading: false,
  error: false,
  process: false,
};

const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducerActions, initialState);

  // loads files into state from idb if they exist
  useEffect(() => {
    const loadFromIdb = async () => {
      let zipFile = await get("zipFile");
      if (zipFile !== undefined) {
        dispatch({ type: "LOADING" });
        let unZippedFiles = await get("zip");
        dispatch({
          type: "UNZIPPED_FILES_LOADED",
          payload: unZippedFiles ? unZippedFiles : [],
          zipFile: zipFile
        });
      }
    };
    loadFromIdb();
  }, []);

  // couldn't figure out another way to fire async dispatches using useReducer,
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
      if (uzip.length > 0) {
        await set("zip", uzip);
      }
      await set("zipFile", zipDetails);
      dispatch({
        type: "UNZIPPED_FILES_LOADED",
        payload: uzip,
        zipFile: zipDetails,
      });
    };
    if (state.process) {
      unZip();
    }
  }, [state.process, state.zipFile]);

  //   const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {" "}
      {children}{" "}
    </StoreContext.Provider>
  );
};

const useStore = () => {
  const { state, dispatch } = useContext(StoreContext);
  return { state, dispatch };
};

export { StoreProvider, useStore };
