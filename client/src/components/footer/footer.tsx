import { Link } from "react-router-dom";
import "./footer.css";

export default function Footer() {
  return (
    <div className="footer">
      <div className="footer-links">
        <Link to="/upload">Upload</Link>
        &nbsp;&middot;&nbsp;
        <Link to="/browse">Browse</Link>
        {/* &nbsp;&middot;&nbsp;
          <a href="/" target="_blank">Mission</a> */}
        <span className="footer-links-divider">|</span>
        <a href="https://github.com/codiak/socialarchive-dapp" target="_blank" rel="noreferrer">
          Open Source
        </a>
      </div>
      <div>&copy;2022 Social Archive</div>
    </div>
  );
}
