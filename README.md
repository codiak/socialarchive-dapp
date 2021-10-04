## Social Archive

Back-up your social posts on the blockchain.


### Prerequisites

- Docker installed


### Dev Setup


#### Service dependency

You'll need a working swarm environment to run the app locally. This app assumes you are running a Bee Factory:
https://github.com/ethersphere/bee-factory

Quick start guide to running bee-factory:

1. Clone bee-factory

`git clone https://github.com/ethersphere/bee-factory`

2. Within /bee-factory, install dependencies (yarm is highly recommended to properly resolve peer dependencies, especially on Mac)

`yarn install`

3. Run bee-factory setup scrips:

`./scripts/network.sh`
`./scripts/blockchain.sh`

4. Initiate deploying smart contracts:

`npm run migrate:contracts`

5. Supply your dev addresses with tokens (these are set by default, and defined in bee-overlay-addresses.json):

`npm run supply`

6. Test run your bee factory, without Docker:

./scripts/bee.sh start --workers=4

#### Building your Docker Images

7. Running bee-factory, and the associated Swarm, from Docker allows for preserving state or starting with a clean slate, and can simplify development (recommended):

`./scripts/bee-docker-build.sh`
`./scripts/blockchain-docker-build.sh`

8. Running your Docker images generated above:

`./scripts/environment.sh start`

^ This is your go-to command now that you have the images built.


#### Client Set-up

Running the React app in dev mode is as simple as installing dependencies from /client:

`yarn install`

And running:

`yarn start`
