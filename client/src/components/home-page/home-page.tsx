import { Link } from "react-router-dom";
import "./home-page.css";

function HomePage() {
  return (
    <div className="home-page">
      <h1>Create and Access Archived Profiles</h1>
      <div className="center-block">
        <p>Twitter accounts liberated from the platform, archived on the blockchain.</p>
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
      <div className="trophy-cabinet">
        <div className="col">
          <img src="" alt="Swarm logo" />
          <div className="placard">Eth Swarm Grant Project</div>
        </div>
        <div className="col">
          <img src="" alt="Fair Data Society logo" />
          <div className="placard">Adheres to Fair Data Society Principles</div>
        </div>
        <div className="col">
          <img src="" alt="GPL logo" />
          <div className="placard">Open Source (GNU GPL3)</div>
        </div>
      </div>
      <div className="promo-cascade">
        <div className="block-1">
          <h2>Reclaim your Digital Identity</h2>
          <p>
            Social Archive frees your social media personalities being held in data silos under
            monopoly rule.
          </p>
          <p>
            Store your own data, and take back sovereignty to keep from and/or integrate with other
            services as you wish.
          </p>
        </div>
        <div className="block-2">
          <h2>Free Your Data</h2>
          <p>
            In a new age of corporate censorship powers, we want to restore the original
            decentralized promise of the internet. We can no longer trust the handful of data
            maintainers
          </p>
        </div>
        <div className="block-3">
          <h2>Decentralized on Swarm</h2>
          <p>
            To keep archives completely decentralized, and outside of censorship powers,
            SocialArchive uses Swarm to store your social data.
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
