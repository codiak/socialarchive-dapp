import { useState, useEffect } from 'react';

export default function({searchString="", results=null}) {
  const [resultArray, setResultArray] = useState([]);

  useEffect(() => {
    const arr = [];

    if(results && typeof results == "object" && !Array.isArray(results)) {
      for(const name in results) {
        arr.push({name, hash: results[name]});
      }

      setResultArray(arr);
    }
  }, [results]);

  return (
    <>
      <p>Searching for "{searchString}"</p>
      <p>{resultArray.length} results</p>
      
      {resultArray.map(result => (
        <div key={result.name + result.hash} className="search-result">
          <a href={"/archive/" + result.hash}>
            <p>Result: {result.name}</p>
          </a>
        </div>
      ))}
    </>
  );
}
