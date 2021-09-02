import React, { useState, useEffect } from 'react';
import { Address, Bee, PostageBatch } from '@ethersphere/bee-js';
import './App.css';

const beeUrl = "http://localhost:1633"
const APP_TITLE = 'Social Archive'
const POSTAGE_STAMPS_AMOUNT = BigInt(10000)
const POSTAGE_STAMPS_DEPTH = 20
const bee = new Bee(beeUrl);

function App() {
  const [ file, setFile ] = useState<File | null>(null)
  const [ link, setLink ] = useState<string | null>(null)
  const [ uploading, setUploading ] = useState(false)
  const [ error, setError ] = useState<Error | null>(null)

  const [ postageStamps, setPostageStamps ] = useState<PostageBatch[]>([])
  // const [ selectedPostageStamp, setSelectedPostageStamp ] = useState<Address | null>(null)
  const [ loadingStamps, setLoadingStamps ] = useState<boolean>(false)
  const [ creatingStamp, setCreatingStamp ] = useState<boolean>(false)
  const [ stampError, setStampError ] = useState<Error | null>(null)

  useEffect(() => {
    // Set Title
    document.title = APP_TITLE
    // Prepare Stamps
    setLoadingStamps(true)
    bee.getAllPostageBatch()
      .then((ps: PostageBatch[]) => setPostageStamps(ps))
      .catch(setStampError)
      .finally(() => setLoadingStamps(false))
  }, [])

  const createPostageStamp = async () => {
    try {
      setCreatingStamp(true)
      await bee.createPostageBatch(POSTAGE_STAMPS_AMOUNT.toString(), POSTAGE_STAMPS_DEPTH)
      setCreatingStamp(false)

      setLoadingStamps(true)
      const ps = await bee.getAllPostageBatch()
      setPostageStamps(ps)
      setLoadingStamps(false)
    }
    catch(e) {
      setStampError(e)
    }
  }

  const getRandomStamp = () => {
    const i = Math.floor(Math.random() * postageStamps.length)
    return postageStamps[i]['batchID']
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (postageStamps.length <= 0) {
      await createPostageStamp();
    }
    const selectedPostageStamp = getRandomStamp()
    if (file) {
      try {
        setUploading(true)
        setLink(null)

        const hash = await bee.uploadFile(selectedPostageStamp, file)
        setLink(`${beeUrl}/bzz/${hash}`)
      } catch (e) {
        setError(e)
      }
      finally {
        setUploading(false)
      }
    }
  }

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const f = event.target && event.target.files && event.target.files[0]

    setFile(f)
    setError(null)
    setLink(null)
  }

  return (
    <div className="App">
      <header className="App-header">
        {APP_TITLE}
      </header>
      <div className="example-form">
        <code>
          { (loadingStamps || creatingStamp) && <span>Loading...</span> }
          { stampError && <span>{stampError.message}</span> }
        </code>
        <h1>Upload history to Swarm</h1>
        <form onSubmit={handleSubmit}>
          <input type="file" name="file" onChange={onFileChange} />
          <input type="submit" disabled={!file} />
        </form>
        <br />
        <code>
          { uploading && <span>Uploading...</span> }
          { link && <a href={link} target="blank" >{link}</a> }
          { error && <span>{error.message}</span> }
        </code>
      </div>
    </div>
  );
}

export default App;



// import { useState }  from 'react';
// import './App.css';
// import { Bee } from "@ethersphere/bee-js"
// // import {LoginComponent} from "fairdrive-protocol";
// const bee = new Bee('http://localhost:1633')

// function App() {
//   // const [password, setUserPassword] = useState('');

//   // instantiate Buzz class with Swarm node provider
//   const [hash, setHash] = useState('')
//   const [output, setOutput] = useState('')

//   // bee.uploadFile(postageBatchId, "Bee is awesome!", "textfile.txt")

//   const upload = () => {
//     bee.createPostageBatch("100", 17)
//       .then((postageBatchId: any) => {
//         console.log('batchId: ' + postageBatchId)
//         bee.uploadData(postageBatchId, "Bee is awesome!")
//           .then(newHash => {
//             console.log('hash: ' + newHash)
//             setHash(newHash)
//           })
//       })
//   }

//   const download = (h: string) => {
//     bee.downloadData(h)
//       .then(data => {
//         console.log('output: ' + data)
//         setOutput(data.text())
//       })

//   }

//   return (
//     <div className="App">
//       <header className="App-header">
//         Social Archive
//       </header>
//       <div className="example-form">
//         <button onClick={upload}>
//           Upload to Swarm
//         </button>
//         { output }
//         <button onClick={() => download(hash)}>
//           Download from Swarm
//         </button>
//       </div>
//       {/* <LoginComponent password={password} setUserPassword={setUserPassword}
//         podName="Fairdrive"/> */}
//     </div>
//   );
// }

// export default App;
