# Digital Art 

## INTRODUCTION

The digital art smart contract will allow an artist to register their creation to the "record label" contract for a fee. Once the piece is published, artists can collect gratuities by the audience that the record label contract owner can influence. 

The digital art is hashed by the client, the hashcode is stored on the contract itself. 

## DOMAIN OBJECTS 

- Record Label: 
    - Ownable contract. 
    - Allows anyone (except for the owner) to regiser a unique hash of a digial file for a fee of 1 ETH. 
    - Initially, the piece goes to "Applied" state. Then, upon review, only the owner of the contract can flip the status to "Published". 
    - Only the owner of the contract can set the status to "Canceled".
    - Only the owner of the contract can withdraw their funds at any time.

- Digital Art: 
    - Ownable contract.
    - The contract accepts gratuity, of atleast an ETH by anyone. 
    - The owner of the contract can withdraw the funds from the contract to their address at any time

## TWO COMPONENTS
-  Solidity contracts and their test cases. 
-  A blank UI project with a method which calculates the hash of an uploaded file. This is not a fully functionaly UI, but is a good place to start building the UI on the smart contract layer.  

## COMMANDS TO INITIATE THE PROJECT 

truffle init
truffle unbox react

## COMMANDS TO INSTALL COMPONENTS

npm install --save-dev solidity-coverage
npm install react-scripts
npm install keccak256

## COMMANDS TO BUILD AND COMPILE

truffle compile // Into the main directory of bookmaker. 
truffle develop // To bring up the blockchain dev server. 
truffle migrate 

## COMMANDS TO RUN THE WEB APP

// RUN
npm start // to start the app, inside client's directory. 

## COMMANDS TO PERFORM THE UNIT TESTING ON SOLIDITY
UNIT TESTING: 
    truffle test // to test the .sol test case. 
    truffle run coverage // Run this after adding solidity coverage as a plugin in truffle-config.js, and in root. 
    truffle test --show-events // To see the events. 
