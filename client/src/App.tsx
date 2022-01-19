import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UploadPage from "./components/upload-page/upload-page";
import BrowsePage from "./components/browse-page/browse-page";
import ArchivePage from "./components/archive-page/archive-page";
import TestUpload from "./components/test-upload";
import "./App.css";
import { Helmet, HelmetProvider } from "react-helmet-async";

import { StoreProvider } from "./utils/store";

const APP_TITLE = "Social Archive";

function App() {
  const activeLink = (pathname: string, startsWith?: boolean) => {
    let isActive = (startsWith && window.location.pathname.startsWith(pathname)) || window.location.pathname === pathname;
    return "menu-link " + (isActive ? "active" : "");
  };

  return (
    <div className="wrapper">
      <HelmetProvider>
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
              <Route path="/browse" element={<BrowsePage />}>
                <Route path=":section" element={<BrowsePage />} />
              </Route>
              <Route path="/archive" element={<ArchivePage />}>
                <Route path=":user/:section" element={<ArchivePage />} />
              </Route>
              <Route path="/" element={<UploadPage />} />
              <Route path="/test" element={<TestUpload />} />
            </Routes>
          </BrowserRouter>
        </StoreProvider>
      </HelmetProvider>
    </div>
  );
}

export default App;
