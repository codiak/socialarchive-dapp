import { login, logout, getAuthUrl } from "./authModule.js";
import { useState, useEffect } from "react";

export default function Authentication() {
  const [showMenu, setShowMenu] = useState(false);
  const [username, setUsername] = useState(null);

  const [_isLoggedIn, setLoggedIn] = useState(null);

  useEffect(() => {
    login()
      .then((res) => {
        if (res) {
          if (res.username) {
            setUsername(res.username);
          }
          setLoggedIn(true);
        } else setLoggedIn(false);
      })
      .catch((e) => setLoggedIn(false));
  }, []);

  if (_isLoggedIn && username) {
    return (
      <>
        <div className="auth">
          <span className="menu-item menu-link" onClick={() => setShowMenu(!showMenu)}>
            @{username}
          </span>

          {showMenu && (
            <div className="menu--user-menu">
              <button className="link menu-link" onClick={logout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </>
    );
  } else if (_isLoggedIn === false) {
    return (
      <a className="menu-link menu-item" href={getAuthUrl()}>
        Login
      </a>
    );
  } else return <></>;
}
