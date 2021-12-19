import { createContext, useState, useContext, useEffect, useMemo, useReducer, useCallback } from "react";
import { convertBytesToString } from "./index";
import { get, set } from "idb-keyval";
import { Zip } from "../process/Zip";

const reducerActions = (state = initialState, action) => {
  console.log("action: ", action.type);
  switch (action.type) {
    case "SET_ZIP_FILE":
      let file = action.payload;
      return { ...state, loading: true, error: false, zipFile: file, process: true };
    case "UNZIP":
      return { ...state, loading: false, error: false, unZippedFiles: action.payload, zipFile: action.zipFile, process: false };
    case "LOADING":
      return { ...state, loading: true, error: false, unZippedFiles: [] };
    case "ERROR":
      return { ...state, loading: false, error: true, unZippedFiles: [] };
    default:
      return state;
  }
};

const StoreContext = createContext({});

const initialState = {
  unZippedFiles: [],
  zipFile: undefined,
  loading: false,
  error: false,
  process: false,
};

const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducerActions, initialState);

  // fires
  useEffect(() => {
    const loadFromIdb = async () => {
      let zipFile = await get("zipFile");
      if (zipFile !== undefined) {
        dispatch({ type: "LOADING" });
        let unZippedFiles = await get("zip");
        dispatch({ type: "UNZIP", payload: unZippedFiles ? unZippedFiles : [], zipFile: zipFile });
      }
    };
    loadFromIdb();
  }, []);

  useEffect(() => {
    const unZip = async () => {
      dispatch({ type: "LOADING" });
      let file = state.zipFile;
      let uzip = await Zip.unzip(file);
      let zipDetails = {
        name: file.name,
        size: convertBytesToString(file.size),
        type: file.type,
        lastModifiedDate: file.lastModifiedDate,
      };
      // if unzip does not return any files, it means that the file is not a real twitter backup file
      if (uzip.length > 0) {
        await set("zip", uzip);
      }
      await set("zipFile", file);
      dispatch({ type: "UNZIP", payload: uzip, zipFile: zipDetails });
    };
    if (state.process) {
      unZip();
    }
  }, [state.process]);

  //   const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>;
};

const useStore = () => {
  const { state, dispatch } = useContext(StoreContext);
  return { state, dispatch };
};

export { StoreProvider, useStore };
