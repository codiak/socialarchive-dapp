import React, { useState, useEffect } from 'react';
import { Bee, PostageBatch } from '@ethersphere/bee-js';

const POSTAGE_STAMPS_AMOUNT = BigInt(10000)
const POSTAGE_STAMPS_DEPTH = 20

const beeUrl = "https://bee-1.gateway.ethswarm.org"
const bee = new Bee(beeUrl);

function TestUpload() {
  const [ file, setFile ] = useState<File | null>(null)
  const [ link, setLink ] = useState<string | null>(null)
  const [ uploading, setUploading ] = useState(false)
  const [ error, setError ] = useState<Error | null>(null)
  // const [ data, setData ] = useState<Object | null>(null)

  const [ postageStamps, setPostageStamps ] = useState<PostageBatch[]>([])
  const [ loadingStamps, setLoadingStamps ] = useState<boolean>(false)
  const [ creatingStamp, setCreatingStamp ] = useState<boolean>(false)
  const [ stampError, setStampError ] = useState<Error | null>(null)

  // const pkgJson = `0de4f93d963e2e90090531ce36b8f5a77874fb37f9f410c5dfc0045cad629c8d`
  // // ${beeUrl}/bzz/

  // if (!data) {
  //   try {
  //     bee.downloadReadableFile(pkgJson)
  //       .then(d => {
  //         console.log("Bee download data?")
  //         console.log(d)
  //         setData(d)
  //       })
  //   } catch (e) {
  //     console.log('Error downloading', e)
  //   }
  // }

  useEffect(() => {
    // Set Title
    document.title = 'Social Archive'
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

        const {reference, tagUid} = await bee.uploadFile(selectedPostageStamp, file);
        setLink(`${beeUrl}/bzz/${reference}`)
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

export default TestUpload;