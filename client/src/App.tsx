import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Upload from './components/upload/upload';
import Timeline from './components/timeline/timeline';
import './App.css';

const APP_TITLE = 'Social Archive'

function App() {
  return (
    <div className="wrapper">
      <header className="App-header">
        {APP_TITLE}
        <div className="menu">
          <a className="menu-link" href="/">Upload</a>
          <a className="menu-link" href="/timeline">Timeline</a>
        </div>
      </header>
      <BrowserRouter>
        <Routes>
          <Route path="/timeline" element={<Timeline />}>
            <Route path=":section" element={<Timeline />} />
          </Route>
          <Route path="/">
            <Upload />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
