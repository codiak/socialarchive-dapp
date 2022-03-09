import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./home-page.css";

function HomePage() {
  const textInput = useRef(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const openHash = (hash) => {
    // Example Social Archive Swarm hash:
    // d1989fe8a9d0d229b5c8366d93f82653e5f9f4ed5eaf8c4c18d15c09e5229fe0
    const HASH_REGEX = /^[a-f0-9]{64}$/;
    // Validate
    console.log(hash);
    if (HASH_REGEX.test(hash)) {
      navigate("/archive/" + hash);
    } else {
      setError("The hash provided is invalid, please try again.");
    }
  };

  return (
    <div className="home-page">
      <h1>Archive Your Social Media</h1>
      <div className="center-block">
        <p>Twitter accounts archived and accessible on the blockchain</p>
        <div className="action-row">
          <Link to="/upload" className="action-item btn cta-button">
            Add Archive
          </Link>
          <div className="action-item input-wrap input--big input--with-btn">
            <input type="text" ref={textInput} placeholder="Swarm hash" />
            <button onClick={() => openHash(textInput.current.value)} className="cta-button">
              Access
            </button>
          </div>
          {error && <p className="text-warn">{error}</p>}
        </div>
      </div>
      <div className="divider--white"></div>
      <div className="trophy-cabinet">
        <a
          href="https://www.ethswarm.org/ecosystem.html"
          target="_blank"
          className="col"
          rel="noreferrer"
        >
          <img src="/graphics/swarm-logo.png" alt="Swarm logo" />
          <div className="placard">
            Eth Swarm
            <br />
            Grant Project
          </div>
        </a>
        <a href="https://fairdatasociety.org/" target="_blank" className="col" rel="noreferrer">
          <img className="raised" src="/graphics/fds-logo.png" alt="Fair Data Society logo" />
          <div className="placard">
            Adheres to
            <br />
            Fair Data Society
            <br />
            Principles
          </div>
        </a>
        <a
          href="https://github.com/codiak/socialarchive-dapp/"
          target="_blank"
          className="col"
          rel="noreferrer"
        >
          <img src="/graphics/gpl-logo.png" alt="GPL logo" />
          <div className="placard">
            Open Source
            <br />
            (GNU GPL3)
          </div>
        </a>
      </div>
      <div className="promo-cascade">
        <div className="blockwrap">
          <div className="block-1">
            <h2>
              Reclaim your
              <br />
              Digital Identity
            </h2>
            <p>
              Social Archive frees your social media personalities being held in data silos under
              monopoly rule.
            </p>
            <p>
              <span className="highlight">Store your own data</span>, and take back agency over
              which services access your data.
            </p>
          </div>
          <div className="block-2">
            <h2>Free Your Data</h2>
            <p>
              In a new age of corporate censorship powers, we want to restore{" "}
              <span className="highlight">the promise of the decentralized internet</span>. We can
              no longer trust the handful of data maintainers.
            </p>
          </div>
          <div className="block-3">
            <h2>Decentralized on Swarm</h2>
            <p>
              To keep archives outside of censorship powers, SocialArchive uses{" "}
              <span className="highlight">Swarm powered by Ethereum</span> to store your social
              data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
