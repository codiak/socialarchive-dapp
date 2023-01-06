import { useState } from "react";

export default function SearchBox() {
  const [searchString, setSearchString] = useState("");

  const loadSearchResults = () => {
    window.location.href = "/search?username=" + searchString;
  };

  const keydownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === "Enter") {
      loadSearchResults();
    }
  };

  return (
    <>
      <div className="search-box menu-item menu-item--right input--with-btn__wrap">
        <input
          type="text"
          placeholder="username"
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
          onKeyDown={keydownHandler}
        />
        <button className="btn btn-small primary" onClick={loadSearchResults}>
          Search
        </button>
      </div>
    </>
  );
}
