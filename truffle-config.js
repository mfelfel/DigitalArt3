const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      port: 8545
    }
  },
  
  plugins: ["solidity-coverage"],
  compilers: {
    solc: {
      optimizer: { enabled: true, runs: 200 },
      version: "0.8.3"
      }
    }
};
