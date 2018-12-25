# Hyperledger-Medical-Network
This is a Hyperledger Composer based sample project which is developed considering a medical use case.

## Getting Started
These instructions will get you the project up and running for development and testing purposes.

Make sure you have [Node.js](https://nodejs.org/en/download/) installed on your machine.

After that follow [this](https://hyperledger.github.io/composer/latest/installing/development-tools.html) guide to setup the environment.

## Build and Install
To run the server, first deploy the business network, make sure fabric is running:
```
cd "network file"
$ composer runtime install --card PeerAdmin@hlfv1 --businessNetworkName my-network
$ composer network start --card PeerAdmin@hlfv1 --networkAdmin admin --networkAdminEnrollSecret adminpw --archiveFile my-network@0.1.6.bna --file networkadmin.card
$ composer card import --file networkadmin.card
```
Now, to run the project
```
$ cd project-folder
$ npm install
$ npm start
```
Server will be running at [http://localhost:5000](http://localhost:5000)

## Debugging
```
Use "/logs/serverLogs.log" to debug
```
## Issues 
```
Report your issues at https://github.com/Aniket-Engg/Hyperledger-Medical-Network/issues
```
