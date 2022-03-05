import { Link } from "react-router-dom";
import "./home-page.css";

function HomePage() {
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
            <input type="text" placeholder="Swarm hash" />
            <button className="cta-button">Access</button>
          </div>
        </div>
      </div>
      <div className="divider--white"></div>
      <div className="trophy-cabinet">
        <div className="col">
          <img src="/graphics/swarm-logo.png" alt="Swarm logo" />
          <div className="placard">
            Eth Swarm
            <br />
            Grant Project
          </div>
        </div>
        <div className="col">
          <img className="raised" src="/graphics/fds-logo.png" alt="Fair Data Society logo" />
          <div className="placard">
            Adheres to
            <br />
            Fair Data Society
            <br />
            Principles
          </div>
        </div>
        <div className="col">
          <img src="/graphics/gpl-logo.png" alt="GPL logo" />
          <div className="placard">
            Open Source
            <br />
            (GNU GPL3)
          </div>
        </div>
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
