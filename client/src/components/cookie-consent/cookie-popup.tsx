import "./cookie-popup.css";
import React from "react";

const CookiePopup = ({ dispatch }) => (
  <div className="gdpr-modal-background-deny">
    <div className="gdpr-body">
      <div className="gdpr-tdescription">
        <p>
          We use cookies and other technologies for various reasons including personalization and
          analytics. For the best user experience please click ACCEPT to allow cookies. If you
          refuse to accept cookies you will still be able to access the site, but some functionality
          may be degraded. For more information, please review our{" "}
          <a href="/cookies" className="privacy-link">
            cookies policy
          </a>
          .
        </p>
      </div>
      <div className="group-action-btns">
        <button className="accept-cookies-btn" onClick={() => dispatch({ type: "acceptCurrent" })}>
          ACCEPT
        </button>
        <button className="deny-cookies-btn" onClick={() => dispatch({ type: "declineAll" })}>
          DECLINE
        </button>
      </div>
    </div>
  </div>
);

export default CookiePopup;
