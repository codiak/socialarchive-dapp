import { useState, useEffect } from "react";
import "./searchresults.css";

export default function SearchResults({ searchString = "", results = null }) {
  const [resultArray, setResultArray] = useState(null);

  useEffect(() => {
    const arr = [];

    if (results && typeof results == "object" && !Array.isArray(results)) {
      for (const name in results) {
        arr.push({ name, hash: results[name] });
      }

      setResultArray(arr);
    }
  }, [results]);

  return (
    <div className="search-page">
      <p>Searching for "{searchString}"</p>
      {resultArray && Array.isArray(resultArray) ? (
        <>
          <p className="search-page__subtitle">{resultArray.length} results</p>

          <div className="search-result-list">
            {resultArray.map((result) => (
              <div key={result.name + result.hash} className="search-result">
                <a href={"/archive/" + result.hash}>
                  <p className="search-result__title">{result.name}</p>
                </a>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="search-page__subtitle">Loading...</p>
      )}
    </div>
  );
}
