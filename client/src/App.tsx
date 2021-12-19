import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Upload from "./components/upload/upload";
import Browse from "./components/browse/browse";
import Timeline from "./components/timeline/timeline";
import "./App.css";
import Helmet from "react-helmet";
import { StoreProvider } from "./utils/store";

const APP_TITLE = "Social Archive";

function App() {
  const activeLink = (pathname: string, startsWith?: boolean) => {
    let isActive = (startsWith && window.location.pathname.startsWith(pathname)) || window.location.pathname === pathname;
    return "menu-link " + (isActive ? "active" : "");
  };

  return (
    <div className="wrapper">
      <Helmet>
        <title>Social Archive</title>
        <meta name="description" content="Twitter back-up on the blockchain" />
      </Helmet>
      <header className="App-header">
        <a className="header-logo-link" href="/">
          <img className="header-logo" src={process.env.PUBLIC_URL + "/logo.png"} alt={APP_TITLE} />
        </a>
        <div className="menu">
          <a className={activeLink("/")} href="/">
            Upload
          </a>
          <a className={activeLink("/browse", true)} href="/browse">
            Browse
          </a>
        </div>
        <title>{APP_TITLE}</title>
      </header>
      <StoreProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/browse" element={<Browse />}>
              <Route path=":section" element={<Browse />} />
            </Route>
            <Route path="/timeline" element={<Timeline />}>
              <Route path=":user/:section" element={<Timeline />} />
            </Route>
            <Route path="/" element={<Upload />} />
          </Routes>
        </BrowserRouter>
      </StoreProvider>
    </div>
  );
}

export default App;
