
require("@nomiclabs/hardhat-waffle")
require("hardhat-gas-reporter");
require("@nomiclabs/hardhat-etherscan");

const STUFF = require('./stuff.json')

module.exports = {
  solidity: {
    compilers: [
      {version: "0.8.2"},
      {version: "0.8.0"},
    ]
  },
  networks: {
    mumbai: {
      url: STUFF.POLYGON_MUMBAI_URL,
      accounts: [`0x${STUFF.DEV1}`, `0x${STUFF.DEV2}`, `0x${STUFF.DEV3}`]
    },
    rinkeby: {
      url: STUFF.ETH_RINKEBY_URL,
      accounts: [`0x${STUFF.DEV1}`, `0x${STUFF.DEV2}`, `0x${STUFF.DEV3}`]
    },
    goerli: {
      url: STUFF.ETH_GOERLI_URL,
      accounts: [`0x${STUFF.DEV1}`, `0x${STUFF.DEV2}`, `0x${STUFF.DEV3}`]
    }
  },

  etherscan: {
    apiKey: STUFF.ETHERSCAN_API_KEY
  },

  gasReporter: {
    currency: 'USD',
    gasPrice: 1000
  }
}