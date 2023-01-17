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
      <div className="search-box menu-item">
        <input
          type="text"
          placeholder="username"
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
          onKeyDown={keydownHandler}
        />
        <input type="submit" value="Search" onClick={loadSearchResults} />
      </div>
    </>
  );
}
