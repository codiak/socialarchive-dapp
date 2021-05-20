# Fairdrive Protocol

This is React component modal which will be used as a proxy for connecting on swarm network using FairOS and Fairdrive Connect.

Install the package `yarn add fairdrive-protocol`

## Running the repo and installing package locally

If you clone this repo, make sure to link this project to your project:

1. First inside fairdrive-protocol run `yarn`

2. After all the packages are installed run `yarn run build:package`

3. To link the package locally run `yarn link`

4. Go to your project and run this command `yarn link "fairdrive-protocol"`

5. And run this command `npm link ../../fairdrive-protocol/node_modules/react`

the ../../ is path to where you have cloned fairdrive-protocol repo.

# Reusable components

## Login

To use this component what you need is to add the package

`import {LoginComponent} from "fairdrive-protocol`

Add state for password(later it will be token);

Create state for password/token

`const [password, setUserPassword] = useState(null)`

`<LoginComponent setUserPassword={setUserPassword}/>`

## Upload file

To use this component what you need is to add the package

`import {UploadFileComponent} from "fairdrive-protocol`

create state for upload response which will be true if it is successful or it will record error message

`<UploadFileComponent file={file} setUploadRes={setUploadRes}/>`

Inside your app create file as a Blob

`const file = new Blob([data], { type: "text/plain;charset=utf-8" });`

## Load files -

Component will load all files on current pod and you can pick any file and load it

To use this component what you need is to add the package

`import {LoadFilesComponent} from "fairdrive-protocol`

Create state for files

`const [files, setFiles] = useState(null)`

`<LoadFilesComponent password={password}setFiles={setFiles}></LoadFilesComponent>`

This component will load files from pod and store it to your app state

## Show loaded files

After you loaded the files call up on this component and create state for specific file that you click on to load it in your app

`const [file, setFile] = useState(null)`

` <ListFilesComponent password={password} files={files} setFile={setFile} ></ListFilesComponent>`
