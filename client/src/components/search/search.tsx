import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

// export default function SearchBox({ navigation: {navigate} }) {
export default function SearchBox() {
  const [searchString, setSearchString] = useState("");

  return (
    <>
      <div className="search-box menu-item">
        <input
          type="text"
          placeholder="username"
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
        />
        <input
          type="submit"
          value="Search"
          onClick={() => (window.location.href = "/search?username=" + searchString)}
        />
      </div>
    </>
  );
}
