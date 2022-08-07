import "./cookie-popup.css";
import React from "react";

const CookiePopup = ({ dispatch }) => (
  <div className="gdpr-modal-background-deny">
    <div className="gdpr-body">
      <div className="gdpr-description">
        <p>
          We use cookies and other technologies for various reasons including personalization and
          analytics. Click ACCEPT to allow cookies or DECLINE to refuse all cookies. For information
          about how we use cookies, please refer to our{" "}
          <a href="/cookies" className="privacy-link">
            cookies policy
          </a>
          .
        </p>
      </div>
      <div className="group-action-btns">
        <button className="btn primary" onClick={() => dispatch({ type: "acceptCurrent" })}>
          Accept
        </button>
        <button className="btn secondary" onClick={() => dispatch({ type: "declineAll" })}>
          Decline
        </button>
      </div>
    </div>
  </div>
);

export default CookiePopup;
