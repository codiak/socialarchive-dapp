import { useState } from "react";

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
