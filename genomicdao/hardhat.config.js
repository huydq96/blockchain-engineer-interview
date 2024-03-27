require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia_test: {
      url: process.env.NETWORK_URL,
      accounts: [process.env.PRIVATE_KEY]
    },
  },
};
