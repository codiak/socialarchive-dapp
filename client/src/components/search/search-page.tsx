import { useState, useEffect } from 'react';
import { search } from "./searchModule";
import SearchResults from "./search-results";

export default function() {
  const [searchString, setSearchString] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    const usernameParam = url.searchParams.get("username");

    if (usernameParam && usernameParam.trim() != "")
     setSearchString(usernameParam);

    if(searchString) {
      search(searchString)
      .then(res => {
        console.log("search results", res);
        setSearchResults(res);
      });
    }
  });

  return (
    <>
      <h1>Search Results</h1>

      <SearchResults searchString={searchString} results={searchResults} />
    </>
  );
}
