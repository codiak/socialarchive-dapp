import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Upload from './components/upload/upload';
import './App.css';

const APP_TITLE = 'Social Archive'

function App() {
  return (
    <div className="wrapper">
      <header className="App-header">
        {APP_TITLE}
      </header>
      <BrowserRouter>
        <Switch>
          <Route path="/">
            <Upload />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
