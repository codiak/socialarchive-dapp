/* https://gist.github.com/daankauwenberg/bf0daf4d4a9a157a078ba4ec4559e3ab */
import React, { createContext, useReducer, useEffect, useState, useContext } from "react";
import CookiePopup from "./cookie-popup";

const COOKIE_NAME = "gdpr";

function getCookie() {
  const regex = new RegExp(`(?:(?:^|.*;\\s*)${COOKIE_NAME}\\s*\\=\\s*([^;]*).*$)|^.*$`);
  const cookie = document.cookie.replace(regex, "$1");
  return cookie.length ? JSON.parse(cookie) : undefined;
}

// Initial value is cookie value OR prefered value but not yet set
let initialCookieValue = getCookie() || {
  isSet: 0,
  allowCookies: 1,
};

const CookieConsentStateContext = createContext({});
const CookieConsentDispatchContext = createContext({});

const CookieConsentProvider = ({ children }) => {
  const [popupIsOpen, setPopupIsOpen] = useState(!initialCookieValue.isSet);
  const isCookiesPage = () => {
    console.log(window.location.pathname);
    return window.location.pathname === "/cookies";
  };
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "acceptCurrent":
        setPopupIsOpen(false);
        return {
          ...state,
          isSet: 1,
        };
      case "declineAll":
        setPopupIsOpen(false);
        return {
          isSet: 1,
          allowCookies: 0,
        };
      case "showCookiePopup":
        setPopupIsOpen(true);
        return state;
      default:
        throw new Error();
    }
  }, initialCookieValue);

  // Update the cookie when state changes
  useEffect(() => {
    document.cookie = `${COOKIE_NAME}=${JSON.stringify(state)}`;
  }, [state]);

  return (
    <CookieConsentStateContext.Provider value={state}>
      <CookieConsentDispatchContext.Provider value={dispatch}>
        {popupIsOpen && !isCookiesPage() && <CookiePopup dispatch={dispatch} />}
        {children}
      </CookieConsentDispatchContext.Provider>
    </CookieConsentStateContext.Provider>
  );
};

export { CookieConsentProvider };
