import { useState }  from 'react';
import './App.css';
import {LoginComponent} from "fairdrive-protocol";

function App() {
  const [password, setUserPassword] = useState('');

  return (
    <div className="App">
      <header className="App-header">
        Social Archive
      </header>
      <LoginComponent password={password} setUserPassword={setUserPassword}/>
    </div>
  );
}

export default App;
