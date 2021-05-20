import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Props } from "./components/login/login";
import Login from "./components/login/login";
import { StoreProvider } from "./store/store";
import { ThemeProvider } from "./store/themeContext/themeContext";
import UploadFile from "./components/uploadFile/uploadFile";
import ListFiles from "./components/listFiles/listFiles";
import LoadFiles from "./components/loadFiles/loadFiles";
// export * as services from "./store/services/fairOS";
ReactDOM.render(<App />, document.getElementById("root"));

export const LoginComponent = (props: Props) => {
  return (
    <StoreProvider>
      <ThemeProvider>
        <Login
          setUserPassword={props.setUserPassword}
          podName={props.podName}
        />
      </ThemeProvider>
    </StoreProvider>
  );
};
export const UploadFileComponent = (props: Props) => {
  return (
    <StoreProvider>
      <ThemeProvider>
        <UploadFile file={props.file} setUploadRes={props.setUploadRes} />
      </ThemeProvider>
    </StoreProvider>
  );
};
export const ListFilesComponent = (props: Props) => {
  return (
    <StoreProvider>
      <ThemeProvider>
        <ListFiles
          password={props.password}
          files={props.files}
          setFile={props.setFile}
        />
      </ThemeProvider>
    </StoreProvider>
  );
};
export const LoadFilesComponent = (props: Props) => {
  return (
    <StoreProvider>
      <ThemeProvider>
        <LoadFiles password={props.password} setFiles={props.setFiles} />
      </ThemeProvider>
    </StoreProvider>
  );
};
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
